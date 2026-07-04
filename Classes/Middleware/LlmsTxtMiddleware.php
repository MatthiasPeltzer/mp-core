<?php

declare(strict_types=1);

namespace Mpc\MpCore\Middleware;

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
 * Serves llms.txt: a concise markdown site map for AI agents.
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
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $site = $request->getAttribute('site');
        if (!$site instanceof Site || !$this->matchesSitePath($request, $site, 'llms.txt')) {
            return $handler->handle($request);
        }

        if (!$this->isTruthySiteSetting($site, 'seo.llmsTxt.enabled', true)) {
            return $handler->handle($request);
        }

        $language = $this->resolveSiteLanguage($request, $site);
        $cacheIdentifier = $this->geoTextCacheIdentifier('llms', $site, $language);

        $content = $this->cache->get($cacheIdentifier);
        if (!is_string($content)) {
            $content = $this->buildLlmsTxt($request, $site);
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

    private function buildLlmsTxt(ServerRequestInterface $request, Site $site): string
    {
        $siteConfig = $site->getConfiguration();
        $websiteTitle = trim((string)($siteConfig['websiteTitle'] ?? ''));
        if ($websiteTitle === '') {
            $websiteTitle = 'Website';
        }

        $description = trim((string)$this->resolveSiteSetting($site, 'seo.meta.defaultDescription', ''));
        $baseUrl = $this->resolveSiteBaseUrl($site);
        $language = $this->resolveSiteLanguage($request, $site);

        $lines = [
            '# ' . $websiteTitle,
            '',
        ];

        if ($description !== '') {
            $lines[] = $description;
            $lines[] = '';
        }

        foreach ($this->resolveMenuPages($site, $language, $site->getRootPageId()) as $section) {
            $lines[] = '## [' . $section['title'] . '](' . $section['url'] . ')';

            if ($section['description'] !== '') {
                $lines[] = '';
                $lines[] = $section['description'];
            }

            $children = $this->resolveMenuPages($site, $language, $section['uid']);
            if ($children !== []) {
                $lines[] = '';
                foreach ($children as $child) {
                    $line = '- [' . $child['title'] . '](' . $child['url'] . ')';
                    if ($child['description'] !== '') {
                        $line .= ': ' . $child['description'];
                    }
                    $lines[] = $line;
                }
            }

            $lines[] = '';
        }

        $lines[] = '## Sitemap';
        $lines[] = '';
        $lines[] = '- [XML Sitemap](' . $baseUrl . '/sitemap.xml)';

        return rtrim(implode("\n", $lines)) . "\n";
    }

    /**
     * Resolves the direct child pages of a given parent as normalized entries.
     *
     * @return list<array{uid: int, title: string, url: string, description: string}>
     */
    private function resolveMenuPages(Site $site, SiteLanguage $language, int $parentPageId): array
    {
        // Select `*`: TYPO3 core documents that restricting getMenu()'s field
        // list breaks its internal shortcut resolution (sub-methods rely on
        // fields like `doktype`/`shortcut`).
        $additionalWhere = 'pages.no_index = 0 AND pages.nav_hide = 0';
        $menuPages = $this->pageRepository->getMenu(
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
}
