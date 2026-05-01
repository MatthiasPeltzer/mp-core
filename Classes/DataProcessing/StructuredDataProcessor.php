<?php

declare(strict_types=1);

namespace Mpc\MpCore\DataProcessing;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Routing\PageArguments;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

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
        $pageRow = $cObj->data;
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

        $breadcrumbItems = $this->buildBreadcrumbList($cObj, $processedData['breadcrumb'] ?? []);
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
     * @param list<array<string, mixed>> $breadcrumb
     * @return list<array<string, mixed>>
     */
    private function buildBreadcrumbList(ContentObjectRenderer $cObj, array $breadcrumb): array
    {
        $items = [];
        $position = 1;
        foreach ($breadcrumb as $row) {
            $data = $row['data'] ?? null;
            $pageUid = is_array($data) ? (int)($data['uid'] ?? 0) : 0;
            $title = trim((string)($row['title'] ?? ''));
            if ($pageUid <= 0 || $title === '') {
                continue;
            }
            $url = $this->absolutePageUrl($cObj, $pageUid);
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
