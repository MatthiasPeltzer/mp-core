<?php

declare(strict_types=1);

namespace Mpc\MpCore\DataProcessing;

use Mpc\MpCore\Enum\StructuredDataExtraEntityType;
use Mpc\MpCore\Schema\PublisherSchemaBuilder;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Routing\PageArguments;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Frontend\Page\PageInformation;

/**
 * Builds one Schema.org JSON-LD @graph with json_encode for safe output.
 *
 * The publisher (Organization / Person) node is assembled by the shared
 * {@see PublisherSchemaBuilder} so the site-wide @graph and the NewsArticle
 * markup stay in sync.
 */
final class StructuredDataProcessor implements DataProcessorInterface
{
    public function __construct(
        private readonly PublisherSchemaBuilder $publisherBuilder,
    ) {}

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

    /**
     * @param array<string, mixed> $contentObjectConfiguration
     * @param array<string, mixed> $processorConfiguration
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
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

        if (!$this->isStructuredDataEnabled($site)) {
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
        $websiteTitle = (string)($siteConfig['websiteTitle'] ?? '');
        $homeUrl = $this->absolutePageUrl($cObj, $site->getRootPageId());

        $publisherId = $homeUrl . '#publisher';
        $websiteId = $homeUrl . '#website';

        $graph = [];

        $graph[] = $this->publisherBuilder->build($cObj, $site, $homeUrl, $publisherId, $processedData['socialMediaUrls'] ?? []);

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

        $extraEntity = $this->buildExtraEntity($cObj, $site, $processedData, $homeUrl, $websiteTitle);
        if ($extraEntity !== []) {
            $graph[] = $extraEntity;
        }

        // The BreadcrumbList is built first so the WebPage can reference it by
        // @id (and so a WebPage.breadcrumb reference never dangles).
        $breadcrumbItems = $this->buildBreadcrumbList($cObj, $request);
        $currentPageUrl = $this->absolutePageUrl($cObj, (int)($pageRow['uid'] ?? 0));
        $breadcrumbId = ($breadcrumbItems !== [] && $currentPageUrl !== '') ? $currentPageUrl . '#breadcrumb' : '';

        if (!$this->isNewsDetailRequest($request)) {
            $graph[] = $this->buildWebPageEntity($cObj, $site, $pageRow, $processedData, $publisherId, $websiteId, $currentPageUrl, $breadcrumbId);
        }

        if ($breadcrumbItems !== []) {
            $breadcrumbList = ['@type' => 'BreadcrumbList'];
            if ($breadcrumbId !== '') {
                $breadcrumbList['@id'] = $breadcrumbId;
            }
            $breadcrumbList['itemListElement'] = $breadcrumbItems;
            $graph[] = $breadcrumbList;
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

    /**
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
    private function buildExtraEntity(
        ContentObjectRenderer $cObj,
        Site $site,
        array $processedData,
        string $homeUrl,
        string $websiteTitle
    ): array {
        $entityType = $this->resolveExtraEntityType($site);
        if ($entityType === StructuredDataExtraEntityType::None) {
            return [];
        }

        $name = trim($this->resolveSiteValue($site, 'structuredData.extraEntity.name', 'musicGroupName'));
        if ($name === '') {
            $name = $websiteTitle;
        }
        if ($name === '') {
            return [];
        }

        $entity = [
            '@type' => $entityType->value,
            'name' => $name,
            'url' => $homeUrl,
        ];

        $sameAs = $processedData['extraEntitySameAsUrls']
            ?? $processedData['musicGroupSameAsUrls']
            ?? [];
        if (is_array($sameAs) && $sameAs !== []) {
            $entity['sameAs'] = $sameAs;
        }

        $description = trim($this->resolveSiteValue($site, 'structuredData.extraEntity.description', 'musicGroupDescription'));
        if ($description !== '') {
            $entity['description'] = mb_substr($this->plainText($description), 0, 500);
        }

        $imageRef = $this->resolveExtraEntityImageReference($site);
        if ($imageRef !== '') {
            $imgObj = $this->publisherBuilder->buildImageObject($cObj, $imageRef);
            if ($imgObj !== []) {
                $entity['image'] = $imgObj;
            }
        }

        $this->applyExtraEntityKeywords($entity, $entityType, $site);

        return $entity;
    }

    /**
     * @param array<string, mixed> $entity
     */
    private function applyExtraEntityKeywords(array &$entity, StructuredDataExtraEntityType $entityType, Site $site): void
    {
        $property = $entityType->keywordsSchemaProperty();
        if ($property === null) {
            return;
        }

        $keywords = trim((string)(
            $this->resolveSiteValue($site, 'structuredData.extraEntity.keywords')
            ?: $this->resolveSiteValue($site, 'structuredData.extraEntity.genre', 'musicGroupGenre')
        ));
        if ($keywords === '') {
            return;
        }

        if ($property === 'genre') {
            $entity['genre'] = $keywords;

            return;
        }

        $topics = array_values(array_filter(array_map(trim(...), explode(',', $keywords))));
        if ($topics === []) {
            return;
        }

        $entity[$property] = count($topics) === 1 ? $topics[0] : $topics;
    }

    private function resolveExtraEntityImageReference(Site $site): string
    {
        foreach (['extraEntityImage', 'structuredData.extraEntity.image', 'musicGroupImage'] as $key) {
            $value = trim((string)$this->resolveSiteValue($site, $key));
            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }

    private function resolveExtraEntityType(Site $site): StructuredDataExtraEntityType
    {
        $typeValue = trim($this->resolveSiteValue($site, 'structuredData.extraEntity.type'));
        if ($typeValue !== '') {
            if ($typeValue === 'none') {
                return StructuredDataExtraEntityType::None;
            }

            return StructuredDataExtraEntityType::tryFrom($typeValue) ?? StructuredDataExtraEntityType::None;
        }

        if (filter_var($this->resolveSiteValue($site, 'musicGroupEnabled', default: false), FILTER_VALIDATE_BOOLEAN)) {
            return StructuredDataExtraEntityType::MusicGroup;
        }

        return StructuredDataExtraEntityType::None;
    }

    private function resolveSiteValue(Site $site, string $key, ?string $legacyKey = null, mixed $default = ''): mixed
    {
        $settings = $site->getSettings();
        $value = $settings->get($key);
        if ($value !== null && $value !== '') {
            return $value;
        }

        $config = $site->getConfiguration();
        if (array_key_exists($key, $config) && $config[$key] !== null && $config[$key] !== '') {
            return $config[$key];
        }

        if ($legacyKey !== null) {
            $legacyValue = $settings->get($legacyKey);
            if ($legacyValue !== null && $legacyValue !== '') {
                return $legacyValue;
            }
            if (array_key_exists($legacyKey, $config) && $config[$legacyKey] !== null && $config[$legacyKey] !== '') {
                return $config[$legacyKey];
            }
        }

        return $default;
    }

    /**
     * JSON-LD is emitted only when both the base structuredDataEnabled toggle
     * and the seo.schema.enabled SEO toggle are truthy (both default to true).
     */
    private function isStructuredDataEnabled(Site $site): bool
    {
        $settings = $site->getSettings();

        return filter_var($settings->get('structuredDataEnabled') ?? true, FILTER_VALIDATE_BOOLEAN)
            && filter_var($settings->get('seo.schema.enabled') ?? true, FILTER_VALIDATE_BOOLEAN);
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
        string $websiteId,
        string $canonicalUrl,
        string $breadcrumbId
    ): array {
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

        if ($breadcrumbId !== '') {
            $entity['breadcrumb'] = ['@id' => $breadcrumbId];
        }

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
            $entity['primaryImageOfPage'] = [
                '@type' => 'ImageObject',
                'url' => $imageUrl,
            ];
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

    private function plainText(string $html): string
    {
        if ($html === '') {
            return '';
        }
        $breaks = str_ireplace(['<br>', '<br/>', '<br />'], "\n", $html);

        return trim(preg_replace('/\s+/u', ' ', strip_tags($breaks)) ?? '');
    }
}
