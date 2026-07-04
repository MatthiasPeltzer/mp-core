<?php

declare(strict_types=1);

namespace Mpc\MpCore\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Site\Entity\Site;

/**
 * Serves a dynamic robots.txt with sitemap reference and optional AI-crawler rules.
 */
final class RobotsTxtMiddleware implements MiddlewareInterface
{
    use GeoTextFileMiddlewareTrait;

    public function __construct(
        private readonly FrontendInterface $cache,
    ) {}

    /**
     * Default crawl rules for the generic `User-agent: *` group. Keeps the TYPO3
     * backend and source out of search indexes while allowing public frontend
     * assets shipped from sysext/frontend.
     *
     * @var list<string>
     */
    private const DEFAULT_RULES = [
        'Disallow: /typo3/',
        'Disallow: /typo3_src/',
        'Allow: /typo3/sysext/frontend/Resources/Public/*',
    ];

    /**
     * Common AI / generative search crawlers (training + retrieval).
     *
     * @var list<string>
     */
    private const AI_CRAWLERS = [
        'GPTBot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'ClaudeBot',
        'anthropic-ai',
        'PerplexityBot',
        'Google-Extended',
        'CCBot',
        'Applebot-Extended',
    ];

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $site = $request->getAttribute('site');
        if (!$site instanceof Site || !$this->matchesSitePath($request, $site, 'robots.txt')) {
            return $handler->handle($request);
        }

        if (!$this->isTruthySiteSetting($site, 'seo.robots.enabled', true)) {
            return $handler->handle($request);
        }

        $language = $this->resolveSiteLanguage($request, $site);
        $cacheIdentifier = $this->geoTextCacheIdentifier('robots', $site, $language);

        $content = $this->cache->get($cacheIdentifier);
        if (!is_string($content)) {
            $content = $this->buildRobotsTxt($site);
            $this->cache->set(
                $cacheIdentifier,
                $content,
                $this->geoTextCacheTags($site),
                self::GEO_TEXT_CACHE_LIFETIME
            );
        }

        return new HtmlResponse($content, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }

    private function buildRobotsTxt(Site $site): string
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
        ];

        foreach (self::DEFAULT_RULES as $rule) {
            $lines[] = $rule;
        }

        $lines[] = '';

        if (!$this->isTruthySiteSetting($site, 'seo.robots.allowAiBots', true)) {
            foreach (self::AI_CRAWLERS as $bot) {
                $lines[] = 'User-agent: ' . $bot;
                $lines[] = 'Disallow: /';
                $lines[] = '';
            }
        }

        $lines[] = 'Sitemap: ' . $this->resolveSiteBaseUrl($site) . '/sitemap.xml';

        $additional = trim((string)$this->resolveSiteSetting($site, 'seo.robots.additional', ''));
        if ($additional !== '') {
            $lines[] = '';
            $lines[] = rtrim($additional, "\r\n");
        }

        return rtrim(implode("\n", $lines)) . "\n";
    }
}
