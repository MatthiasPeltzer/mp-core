<?php

declare(strict_types=1);

namespace Mpc\MpCore\Middleware;

use Mpc\MpCore\Service\LanguageAwarePageRepositoryFactory;
use Mpc\MpCore\Service\LlmsTxtNewsProvider;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Routing\InvalidRouteArgumentsException;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Serves llms.txt: a concise markdown site map for AI agents. A localized
 * variant is served per enabled site language (`/llms.txt`, `/en/llms.txt`, …),
 * each listing that language's pages and cross-linking the other variants.
 */
final class LlmsTxtMiddleware implements MiddlewareInterface
{
    use GeoTextFileMiddlewareTrait;

    private const MAX_DESCRIPTION_LENGTH = 160;

    /**
     * @var list<int>
     */
    private const EXCLUDED_DOKTYPES = [
        PageRepository::DOKTYPE_LINK,
        PageRepository::DOKTYPE_SHORTCUT,
        PageRepository::DOKTYPE_BE_USER_SECTION,
        PageRepository::DOKTYPE_MOUNTPOINT,
        PageRepository::DOKTYPE_SPACER,
        PageRepository::DOKTYPE_SYSFOLDER,
        255,
    ];

    public function __construct(
        private readonly PageRepository $pageRepository,
        private readonly FrontendInterface $cache,
        private readonly LlmsTxtNewsProvider $newsProvider,
        private readonly LanguageAwarePageRepositoryFactory $pageRepositoryFactory,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $site = $request->getAttribute('site');
        if (!$site instanceof Site) {
            return $handler->handle($request);
        }

        $language = $this->matchesLanguageFile($request, $site, 'llms.txt');
        if ($language === null) {
            return $handler->handle($request);
        }

        if (!$this->isTruthySiteSetting($site, 'seo.llmsTxt.enabled', true)) {
            return $handler->handle($request);
        }

        $cacheIdentifier = $this->geoTextCacheIdentifier('llms', $site, $language);

        $content = $this->cache->get($cacheIdentifier);
        if (!is_string($content)) {
            $content = $this->buildLlmsTxt($site, $language);
            $this->cache->set(
                $cacheIdentifier,
                $content,
                $this->geoTextCacheTags($site),
                self::GEO_TEXT_CACHE_LIFETIME
            );
        }

        return new HtmlResponse($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
        ]);
    }

    private function buildLlmsTxt(Site $site, SiteLanguage $language): string
    {
        $siteConfig = $site->getConfiguration();
        $websiteTitle = $this->languageAttribute($language, 'websiteTitle')
            ?: trim((string)($siteConfig['websiteTitle'] ?? ''));
        if ($websiteTitle === '') {
            $websiteTitle = 'Website';
        }

        // Per-language override (Site config → Languages) with global setting fallback.
        $description = $this->languageAttribute($language, 'llmsTxtDescription')
            ?: trim((string)$this->resolveSiteSetting($site, 'seo.meta.defaultDescription', ''));
        $languageBaseUrl = rtrim((string)$language->getBase(), '/');

        $lines = [
            '# ' . $websiteTitle,
            '',
        ];

        if ($description !== '') {
            $lines[] = '> ' . $description;
            $lines[] = '';
        }

        $intro = $this->languageAttribute($language, 'llmsTxtIntro')
            ?: trim((string)$this->resolveSiteSetting($site, 'seo.llmsTxt.intro', ''));
        if ($intro !== '') {
            $lines[] = trim(preg_replace('/\n{3,}/', "\n\n", str_replace("\r\n", "\n", $intro)) ?? $intro);
            $lines[] = '';
        }

        $menuRepository = $this->menuRepository($language);

        foreach ($this->resolveMenuPages($menuRepository, $site, $language, $site->getRootPageId()) as $section) {
            $lines[] = '## ' . $this->markdownLink($section['title'], $section['url']);

            if ($section['description'] !== '') {
                $lines[] = '';
                $lines[] = $section['description'];
            }

            $children = $this->resolveMenuPages($menuRepository, $site, $language, $section['uid']);
            if ($children !== []) {
                $lines[] = '';
                foreach ($children as $child) {
                    $line = '- ' . $this->markdownLink($child['title'], $child['url']);
                    if ($child['description'] !== '') {
                        $line .= ': ' . $child['description'];
                    }
                    $lines[] = $line;
                }
            }

            $lines[] = '';
        }

        foreach ($this->buildNewsSection($site, $language) as $line) {
            $lines[] = $line;
        }

        foreach ($this->buildAboutSection($site) as $line) {
            $lines[] = $line;
        }

        $languageLinks = $this->resolveLanguageLinks($site, $language);
        if ($languageLinks !== []) {
            $lines[] = '## Languages';
            $lines[] = '';
            foreach ($languageLinks as $link) {
                $lines[] = '- ' . $link;
            }
            $lines[] = '';
        }

        $lines[] = '## Sitemap';
        $lines[] = '';
        $lines[] = '- [XML Sitemap](' . $languageBaseUrl . '/sitemap.xml)';

        return rtrim(implode("\n", $lines)) . "\n";
    }

    /**
     * Markdown links to each enabled language's llms.txt (only when the site has
     * more than one language), with the current language marked.
     *
     * @return list<string>
     */
    private function resolveLanguageLinks(Site $site, SiteLanguage $current): array
    {
        $languages = $site->getLanguages();
        if (count($languages) < 2) {
            return [];
        }

        $links = [];
        foreach ($languages as $language) {
            $label = trim($language->getNavigationTitle()) ?: trim($language->getTitle());
            if ($label === '') {
                $label = $language->getHreflang() ?: ('language ' . $language->getLanguageId());
            }
            $url = rtrim((string)$language->getBase(), '/') . '/llms.txt';
            $marker = $language->getLanguageId() === $current->getLanguageId() ? ' (current)' : '';
            $links[] = $this->markdownLink($label, $url) . $marker;
        }

        return $links;
    }

    /**
     * "Latest news" section, listing the most recent EXT:news articles for the
     * current language. Returns an empty list when the news storage/detail page
     * is not configured or EXT:news is unavailable.
     *
     * @return list<string>
     */
    private function buildNewsSection(Site $site, SiteLanguage $language): array
    {
        $storagePids = $this->parseIntList((string)$this->resolveSiteSetting($site, 'seo.llmsTxt.news.storagePid', ''));
        $detailPageId = (int)$this->resolveSiteSetting($site, 'seo.llmsTxt.news.detailPageId', 0);
        $limit = max(1, (int)$this->resolveSiteSetting($site, 'seo.llmsTxt.news.limit', 5));

        $items = $this->newsProvider->recentNews($site, $language, $storagePids, $detailPageId, $limit);
        if ($items === []) {
            return [];
        }

        $lines = ['## Latest news', ''];
        foreach ($items as $item) {
            $line = '- ' . $this->markdownLink($item['title'], $item['url']);
            $teaser = $this->truncate($item['teaser']);
            if ($teaser !== '') {
                $line .= ': ' . $teaser;
            }
            $lines[] = $line;
        }
        $lines[] = '';

        return $lines;
    }

    /**
     * "About" section describing the publisher, derived from the shared
     * `seo.schema.*` Site Settings. Omitted when no publisher details are set.
     *
     * @return list<string>
     */
    private function buildAboutSection(Site $site): array
    {
        $settings = $site->getSettings();
        $email = trim((string)($settings->get('seo.schema.email') ?? ''));
        $legalName = trim((string)($settings->get('seo.schema.legalName') ?? ''));
        $topics = $this->parseStringList((string)($settings->get('seo.schema.knowsAbout') ?? ''));

        if ($email === '' && $legalName === '' && $topics === []) {
            return [];
        }

        $config = $site->getConfiguration();
        $type = trim((string)($settings->get('seo.schema.organizationType') ?? ''))
            ?: trim((string)($config['schemaType'] ?? ''))
            ?: 'Person';

        if ($type === 'Person') {
            // A Person's name is the given + family name (as used by
            // PublisherSchemaBuilder), not the website title.
            $name = trim(
                trim((string)($config['schemaGivenName'] ?? ''))
                . ' '
                . trim((string)($config['schemaFamilyName'] ?? ''))
            );
            if ($name === '') {
                $name = trim((string)($settings->get('seo.schema.alternateName') ?? ''));
            }
        } else {
            $name = $legalName;
        }

        if ($name === '') {
            $name = trim((string)($config['websiteTitle'] ?? ''));
        }

        $lines = ['## About', ''];
        if ($name !== '') {
            $lines[] = '- Publisher: ' . $name . ' (' . $type . ')';
        }
        if ($email !== '') {
            $lines[] = '- Email: ' . $email;
        }
        if ($topics !== []) {
            $lines[] = '- Topics: ' . implode(', ', $topics);
        }
        $lines[] = '';

        return $lines;
    }

    /**
     * PageRepository used to resolve the page menu. The default language uses the
     * injected (default-context) repository; other languages get a language-aware
     * repository so `getMenu()` returns the correct translation overlay.
     */
    private function menuRepository(SiteLanguage $language): PageRepository
    {
        if ($language->getLanguageId() === 0) {
            return $this->pageRepository;
        }

        return $this->pageRepositoryFactory->create($language);
    }

    /**
     * Reads a custom per-language attribute from the Site Configuration
     * (Languages → site_language), e.g. `llmsTxtIntro`, returning '' when unset.
     */
    private function languageAttribute(SiteLanguage $language, string $key): string
    {
        $value = $language->toArray()[$key] ?? '';

        return is_string($value) ? trim($value) : '';
    }

    /**
     * @return list<int>
     */
    private function parseIntList(string $raw): array
    {
        $ints = [];
        foreach (explode(',', $raw) as $part) {
            $part = trim($part);
            if ($part !== '' && ctype_digit($part)) {
                $ints[] = (int)$part;
            }
        }

        return $ints;
    }

    /**
     * @return list<string>
     */
    private function parseStringList(string $raw): array
    {
        return array_values(array_filter(array_map(trim(...), explode(',', $raw))));
    }

    /**
     * Resolves the direct child pages of a given parent as normalized entries.
     *
     * @return list<array{uid: int, title: string, url: string, description: string}>
     */
    private function resolveMenuPages(
        PageRepository $pageRepository,
        Site $site,
        SiteLanguage $language,
        int $parentPageId
    ): array {
        // Select `*`: TYPO3 core documents that restricting getMenu()'s field
        // list breaks its internal shortcut resolution (sub-methods rely on
        // fields like `doktype`/`shortcut`).
        $additionalWhere = 'pages.no_index = 0 AND pages.nav_hide = 0';
        $menuPages = $pageRepository->getMenu(
            $parentPageId,
            '*',
            'sorting',
            $additionalWhere
        );

        $pages = [];
        foreach ($menuPages as $page) {
            if (!is_array($page)) {
                continue;
            }
            if (in_array((int)($page['doktype'] ?? 0), self::EXCLUDED_DOKTYPES, true)) {
                continue;
            }

            $pageUid = (int)($page['uid'] ?? 0);
            if ($pageUid <= 0) {
                continue;
            }

            $title = trim((string)(($page['nav_title'] ?? '') ?: ($page['title'] ?? '')));
            if ($title === '') {
                continue;
            }

            $url = $this->resolvePageUrl($site, $language, $pageUid);
            if ($url === '') {
                continue;
            }

            $pages[] = [
                'uid' => $pageUid,
                'title' => $title,
                'url' => $url,
                'description' => $this->resolvePageDescription($page),
            ];
        }

        return $pages;
    }

    /**
     * @param array<string, mixed> $page
     */
    private function resolvePageDescription(array $page): string
    {
        $text = (string)(($page['description'] ?? '') ?: ($page['abstract'] ?? ''));

        return $this->truncate($text);
    }

    /**
     * Strips tags, collapses whitespace and truncates to the description limit.
     */
    private function truncate(string $text): string
    {
        $text = trim(preg_replace('/\s+/u', ' ', strip_tags($text)) ?? '');
        if ($text === '') {
            return '';
        }

        if (mb_strlen($text) > self::MAX_DESCRIPTION_LENGTH) {
            $text = rtrim(mb_substr($text, 0, self::MAX_DESCRIPTION_LENGTH - 3)) . '...';
        }

        return $text;
    }

    private function resolvePageUrl(Site $site, SiteLanguage $language, int $pageUid): string
    {
        try {
            $uri = $site->getRouter()->generateUri((string)$pageUid, ['_language' => $language]);
        } catch (InvalidRouteArgumentsException) {
            return '';
        }

        return (string)$uri;
    }

    private function markdownLink(string $label, string $url): string
    {
        return '[' . $this->escapeMarkdownLinkLabel($label) . '](' . $this->escapeMarkdownLinkUrl($url) . ')';
    }

    private function escapeMarkdownLinkLabel(string $label): string
    {
        $label = str_replace('\\', '\\\\', $label);

        return (string)preg_replace('/([\[\]])/', '\\\\$1', $label);
    }

    private function escapeMarkdownLinkUrl(string $url): string
    {
        if (preg_match('/[\s()]/', $url) === 1) {
            return '<' . str_replace('>', '%3E', $url) . '>';
        }

        return $url;
    }
}
