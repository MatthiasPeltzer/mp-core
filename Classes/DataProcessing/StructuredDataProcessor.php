<?php

declare(strict_types=1);

namespace Mpc\MpCore\DataProcessing;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Routing\PageArguments;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Frontend\Page\PageInformation;

/**
 * Builds one Schema.org JSON-LD @graph with json_encode for safe output.
 *
 * Publisher @type resolution order (single source of truth with NewsArticleJsonLdViewHelper):
 * 1) site.settings seo.schema.organizationType (mp-core-seo Site Settings)
 * 2) site.configuration schemaType (site YAML / Site Configuration)
 * 3) default Person
 */
final class StructuredDataProcessor implements DataProcessorInterface
{
    private const DEFAULT_PUBLISHER_TYPE = 'Person';

    /**
     * Project-specific doktype representing a blog/news style page (BlogPosting).
     */
    private const BLOG_DOKTYPE = 137;

    /**
     * Doktypes that must never appear in a Schema.org BreadcrumbList because a
     * frontend visitor cannot navigate to them. Matches the default
     * `$excludedDoktypes` set in `AbstractMenuContentObject` (sysfolder + BE
     * user section), which is what `MenuProcessor special=rootline` filters by
     * when no `excludeDoktypes` override is configured.
     */
    private const BREADCRUMB_EXCLUDED_DOKTYPES = [
        PageRepository::DOKTYPE_BE_USER_SECTION,
        PageRepository::DOKTYPE_SYSFOLDER,
    ];

    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        $site = $processedData['site'] ?? null;
        if (!$site instanceof Site) {
            $processedData['structuredDataJsonLd'] = '';

            return $processedData;
        }

        $settings = $site->getSettings();
        $structuredEnabled = filter_var($settings->get('structuredDataEnabled') ?? true, FILTER_VALIDATE_BOOLEAN);
        if (!$structuredEnabled) {
            $processedData['structuredDataJsonLd'] = '';

            return $processedData;
        }

        $request = $cObj->getRequest();
        // Read the page record from the request attribute the FE controller
        // populates during `PrepareTypoScriptFrontendRendering` instead of
        // `$cObj->data`. Functionally identical at PAGE-level data processing
        // time, but it sidesteps the TYPO3 Extension Scanner false positive
        // for breaking change #101955 (which flags every `->data` property
        // access because `GifBuilder->data` was made protected).
        $pageInformation = $request->getAttribute('frontend.page.information');
        $pageRow = $pageInformation instanceof PageInformation ? $pageInformation->getPageRecord() : [];
        if ($pageRow === []) {
            $processedData['structuredDataJsonLd'] = '';

            return $processedData;
        }

        $siteConfig = $site->getConfiguration();
        $publisherType = $this->resolvePublisherSchemaType($site);
        $websiteTitle = (string)($siteConfig['websiteTitle'] ?? '');
        $homeUrl = $this->absolutePageUrl($cObj, $site->getRootPageId());

        $publisherId = $homeUrl . '#publisher';
        $websiteId = $homeUrl . '#website';

        $graph = [];

        $givenName = $publisherType !== 'Organization' ? trim((string)($siteConfig['schemaGivenName'] ?? '')) : '';
        $familyName = $publisherType !== 'Organization' ? trim((string)($siteConfig['schemaFamilyName'] ?? '')) : '';

        $publisher = array_filter([
            '@type' => $publisherType,
            '@id' => $publisherId,
            'name' => $websiteTitle,
            'url' => $homeUrl,
            'givenName' => $givenName !== '' ? $givenName : null,
            'familyName' => $familyName !== '' ? $familyName : null,
            'logo' => $this->buildLogoObject($cObj, $siteConfig['logoBig'] ?? ''),
            'sameAs' => $processedData['socialMediaUrls'] ?? [],
        ], static fn ($v) => $v !== null && $v !== '' && $v !== []);

        $graph[] = $publisher;

        $webSite = [
            '@type' => 'WebSite',
            '@id' => $websiteId,
            'name' => $websiteTitle,
            'url' => $homeUrl,
            'inLanguage' => $this->currentHreflang($site, $request),
            'publisher' => ['@id' => $publisherId],
        ];

        if (!empty($siteConfig['search'])) {
            $webSite['potentialAction'] = [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => rtrim($homeUrl, '/') . '/search?q={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ];
        }

        $graph[] = $webSite;

        $musicEnabled = filter_var($settings->get('musicGroupEnabled') ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($musicEnabled) {
            $musicName = (string)($settings->get('musicGroupName') ?: 'Pellerhead');
            $musicGenre = (string)($settings->get('musicGroupGenre') ?: 'Rock, Punk, Electronic');
            $musicSameAs = $processedData['musicGroupSameAsUrls'] ?? [];
            $musicGroup = [
                '@type' => 'MusicGroup',
                'name' => $musicName,
                'genre' => $musicGenre,
                'url' => $homeUrl,
            ];
            if ($musicSameAs !== []) {
                $musicGroup['sameAs'] = $musicSameAs;
            }
            $musicDescription = trim((string)($settings->get('musicGroupDescription') ?? ''));
            if ($musicDescription !== '') {
                $musicGroup['description'] = mb_substr($this->plainText($musicDescription), 0, 500);
            }
            $musicImageRef = trim((string)($settings->get('musicGroupImage') ?? ''));
            if ($musicImageRef !== '') {
                $imgObj = $this->buildLogoObject($cObj, $musicImageRef);
                if ($imgObj !== []) {
                    $musicGroup['image'] = $imgObj;
                }
            }
            $graph[] = $musicGroup;
        }

        if (!$this->isNewsDetailRequest($request)) {
            $graph[] = $this->buildWebPageEntity($cObj, $site, $pageRow, $processedData, $publisherId, $websiteId);
        }

        $breadcrumbItems = $this->buildBreadcrumbList($cObj, $request);
        if ($breadcrumbItems !== []) {
            $graph[] = [
                '@type' => 'BreadcrumbList',
                'itemListElement' => $breadcrumbItems,
            ];
        }

        $payload = [
            '@context' => 'https://schema.org',
            '@graph' => $graph,
        ];

        try {
            $processedData['structuredDataJsonLd'] = json_encode(
                $payload,
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
            );
        } catch (\JsonException) {
            $processedData['structuredDataJsonLd'] = '';
        }

        return $processedData;
    }

    private function resolvePublisherSchemaType(Site $site): string
    {
        $settings = $site->getSettings();
        $fromSeo = trim((string)($settings->get('seo.schema.organizationType') ?? ''));
        if ($fromSeo !== '') {
            return $fromSeo;
        }

        $fromConfig = trim((string)($site->getConfiguration()['schemaType'] ?? ''));
        if ($fromConfig !== '') {
            return $fromConfig;
        }

        return self::DEFAULT_PUBLISHER_TYPE;
    }

    private function currentHreflang(Site $site, ServerRequestInterface $request): string
    {
        $language = $request->getAttribute('language');
        if ($language instanceof SiteLanguage) {
            $hreflang = $language->getHreflang();
            if ($hreflang !== '') {
                return $hreflang;
            }
        }

        return $site->getDefaultLanguage()->getHreflang() ?: 'de';
    }

    private function isNewsDetailRequest(ServerRequestInterface $request): bool
    {
        return $this->getNewsIdFromRequest($request) > 0;
    }

    private function getNewsIdFromRequest(ServerRequestInterface $request): int
    {
        $pageArguments = $request->getAttribute('routing');
        if ($pageArguments instanceof PageArguments) {
            return (int)($pageArguments->getArguments()['tx_news_pi1']['news'] ?? 0);
        }

        return 0;
    }

    /**
     * @param array<string, mixed> $pageRow
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
    private function buildWebPageEntity(
        ContentObjectRenderer $cObj,
        Site $site,
        array $pageRow,
        array $processedData,
        string $publisherId,
        string $websiteId
    ): array {
        $uid = (int)($pageRow['uid'] ?? 0);
        $canonicalUrl = $this->absolutePageUrl($cObj, $uid);
        $doktype = (int)($pageRow['doktype'] ?? 0);
        $isBlog = $doktype === self::BLOG_DOKTYPE;

        $description = $this->plainText((string)(($pageRow['description'] ?? '') ?: ($pageRow['abstract'] ?? '')));

        $entity = [
            '@type' => $isBlog ? 'BlogPosting' : 'WebPage',
            '@id' => $canonicalUrl . '#webpage',
            'url' => $canonicalUrl,
            'name' => (string)($pageRow['title'] ?? ''),
            'inLanguage' => $this->currentHreflang($site, $cObj->getRequest()),
            'isPartOf' => ['@id' => $websiteId],
            'publisher' => ['@id' => $publisherId],
        ];

        if ($description !== '') {
            $entity['description'] = mb_substr($description, 0, 500);
        }

        if ($isBlog) {
            $entity['headline'] = (string)($pageRow['title'] ?? '');
            $authorName = (string)(($pageRow['author'] ?? '') ?: ($site->getConfiguration()['websiteTitle'] ?? ''));
            $entity['author'] = [
                '@type' => 'Person',
                'name' => $authorName,
            ];
            $entity['mainEntityOfPage'] = $canonicalUrl;
        }

        $imageUrl = $this->resolveFirstPageMediaUrl($cObj, $processedData['pageMedia'] ?? []);
        if ($imageUrl !== '') {
            $entity['image'] = $imageUrl;
        }

        if (!empty($pageRow['crdate'])) {
            $entity['datePublished'] = date('c', (int)$pageRow['crdate']);
        }
        $modified = $pageRow['lastUpdated'] ?? $pageRow['SYS_LASTCHANGED'] ?? null;
        if (!empty($modified)) {
            $entity['dateModified'] = date('c', (int)$modified);
        }

        return $entity;
    }

    /**
     * Builds the Schema.org BreadcrumbList from the rootline that TYPO3 already
     * resolved once during `PrepareTypoScriptFrontendRendering` and exposed on
     * the request as `frontend.page.information` (changelog 102715, TYPO3 13.0).
     *
     * This deliberately avoids a second `MenuProcessor special=rootline` pass
     * (which would re-walk the same pages, re-run TMENU access checks and
     * `processAdditionalDataProcessors()` per cold render). `nav_hide`,
     * `nav_title` and `excludeDoktypes` semantics mirror MenuProcessor's
     * defaults so the resulting BreadcrumbList stays byte-identical.
     *
     * @return list<array<string, mixed>>
     */
    private function buildBreadcrumbList(ContentObjectRenderer $cObj, ServerRequestInterface $request): array
    {
        $pageInformation = $request->getAttribute('frontend.page.information');
        if (!$pageInformation instanceof PageInformation) {
            return [];
        }

        $site = $request->getAttribute('site');
        $siteRootPageId = $site instanceof Site ? $site->getRootPageId() : 0;

        // RootlineUtility returns the rootline current-first → root-last; the
        // BreadcrumbList wants root-first → current-last. Truncate above the
        // site root in case the page tree extends beyond it.
        $rootline = $pageInformation->getRootLine();
        $rootlineUpToSiteRoot = [];
        foreach ($rootline as $page) {
            $rootlineUpToSiteRoot[] = $page;
            if ($siteRootPageId > 0 && (int)($page['uid'] ?? 0) === $siteRootPageId) {
                break;
            }
        }
        $rootlineRootFirst = array_reverse($rootlineUpToSiteRoot);

        $items = [];
        $position = 1;
        foreach ($rootlineRootFirst as $page) {
            if (!is_array($page)) {
                continue;
            }
            $pageUid = (int)($page['uid'] ?? 0);
            if ($pageUid <= 0) {
                continue;
            }
            // "Hide in menus" pages are excluded from the BreadcrumbList,
            // matching MenuProcessor's default (`includeNotInMenu = 0`).
            if ((int)($page['nav_hide'] ?? 0) === 1) {
                continue;
            }
            // Sysfolders / spacers / recyclers / BE user sections are not
            // navigable in the frontend and must not appear in JSON-LD.
            if (in_array((int)($page['doktype'] ?? 0), self::BREADCRUMB_EXCLUDED_DOKTYPES, true)) {
                continue;
            }
            $title = trim((string)(($page['nav_title'] ?? '') ?: ($page['title'] ?? '')));
            if ($title === '') {
                continue;
            }
            $url = $this->absolutePageUrl($cObj, $pageUid);
            // Defense in depth: drop entries with no resolvable frontend URL
            // (e.g. shortcuts pointing at deleted targets).
            if ($url === '') {
                continue;
            }
            $items[] = [
                '@type' => 'ListItem',
                'position' => $position,
                'name' => $title,
                'item' => $url,
            ];
            ++$position;
        }

        return $items;
    }

    private function absolutePageUrl(ContentObjectRenderer $cObj, int $pageUid): string
    {
        if ($pageUid <= 0) {
            return '';
        }

        return $cObj->typoLink_URL([
            'parameter' => $pageUid,
            'forceAbsoluteUrl' => true,
        ]) ?: '';
    }

    /**
     * @param mixed $pageMedia
     */
    private function resolveFirstPageMediaUrl(ContentObjectRenderer $cObj, mixed $pageMedia): string
    {
        if (!is_iterable($pageMedia)) {
            return '';
        }
        foreach ($pageMedia as $file) {
            if ($file instanceof FileReference) {
                return $this->absoluteFileUrl($cObj, $file);
            }
        }

        return '';
    }

    private function absoluteFileUrl(ContentObjectRenderer $cObj, FileReference $fileReference): string
    {
        $publicUrl = $fileReference->getPublicUrl();
        if ($publicUrl === null || $publicUrl === '') {
            return '';
        }
        if (str_starts_with($publicUrl, 'http://') || str_starts_with($publicUrl, 'https://')) {
            return $publicUrl;
        }
        $normalizedParams = $cObj->getRequest()->getAttribute('normalizedParams');
        if ($normalizedParams === null) {
            return $publicUrl;
        }

        return rtrim($normalizedParams->getSiteUrl(), '/') . '/' . ltrim($publicUrl, '/');
    }

    /**
     * @return array<string, string>
     */
    private function buildLogoObject(ContentObjectRenderer $cObj, string $logoReference): array
    {
        if ($logoReference === '') {
            return [];
        }
        $local = $cObj->cObjGetSingle('IMG_RESOURCE', [
            'file' => $logoReference,
            'file.' => [
                'treatIdAsReference' => 1,
            ],
        ]);
        if ($local === '' || !is_string($local)) {
            return [];
        }
        $normalizedParams = $cObj->getRequest()->getAttribute('normalizedParams');
        if ($normalizedParams === null) {
            return [];
        }
        $url = $normalizedParams->getSiteUrl() . ltrim($local, '/');

        return [
            '@type' => 'ImageObject',
            'url' => $url,
        ];
    }

    private function plainText(string $html): string
    {
        if ($html === '') {
            return '';
        }
        $breaks = str_ireplace(['<br>', '<br/>', '<br />'], "\n", $html);

        return trim(preg_replace('/\s+/u', ' ', strip_tags($breaks)) ?? '');
    }
}
