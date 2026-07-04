<?php

declare(strict_types=1);

namespace Mpc\MpCore\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Shared helpers for /robots.txt and /llms.txt middleware.
 */
trait GeoTextFileMiddlewareTrait
{
    /**
     * Lifetime (seconds) for cached /robots.txt and /llms.txt payloads. Entries
     * are additionally tagged per site so they can be flushed on demand.
     */
    private const GEO_TEXT_CACHE_LIFETIME = 86400;

    private function geoTextCacheIdentifier(string $prefix, Site $site, SiteLanguage $language): string
    {
        return $prefix . '_' . sha1($site->getIdentifier() . '|' . $language->getLanguageId());
    }

    /**
     * @return list<string>
     */
    private function geoTextCacheTags(Site $site): array
    {
        return [
            'mp_core_geotext',
            'site_' . (preg_replace('/[^a-zA-Z0-9_-]/', '_', $site->getIdentifier()) ?? ''),
        ];
    }

    private function matchesSitePath(ServerRequestInterface $request, Site $site, string $expectedPath): bool
    {
        $expectedPath = trim($expectedPath, '/');
        $requestPath = $this->resolveSiteRelativePath($request, $site);

        return $requestPath === $expectedPath;
    }

    /**
     * Resolves which enabled site language's variant of a root file (e.g.
     * `llms.txt`) is being requested by matching each language's base-path
     * prefix (`/llms.txt`, `/en/llms.txt`, …). Returns null when the request
     * does not target that file in any language.
     */
    private function matchesLanguageFile(ServerRequestInterface $request, Site $site, string $filename): ?SiteLanguage
    {
        $filename = trim($filename, '/');
        $requestPath = trim($request->getUri()->getPath(), '/');

        foreach ($site->getLanguages() as $language) {
            $basePath = trim($language->getBase()->getPath(), '/');
            $expected = trim(($basePath !== '' ? $basePath . '/' : '') . $filename, '/');
            if ($requestPath === $expected) {
                return $language;
            }
        }

        return null;
    }

    private function resolveSiteRelativePath(ServerRequestInterface $request, Site $site): string
    {
        $path = ltrim($request->getUri()->getPath(), '/');
        $basePath = trim($site->getBase()->getPath(), '/');
        if ($basePath !== '' && str_starts_with($path, $basePath . '/')) {
            $path = substr($path, strlen($basePath) + 1);
        } elseif ($basePath !== '' && $path === $basePath) {
            $path = '';
        }

        return trim($path, '/');
    }

    private function resolveSiteBaseUrl(Site $site): string
    {
        return rtrim((string)$site->getBase(), '/');
    }

    private function resolveSiteLanguage(ServerRequestInterface $request, Site $site): SiteLanguage
    {
        $language = $request->getAttribute('language');
        if ($language instanceof SiteLanguage) {
            return $language;
        }

        return $site->getDefaultLanguage();
    }

    private function resolveSiteSetting(Site $site, string $key, mixed $default = null): mixed
    {
        $value = $site->getSettings()->get($key);
        if ($value === null || $value === '') {
            return $default;
        }

        return $value;
    }

    private function isTruthySiteSetting(Site $site, string $key, bool $default = true): bool
    {
        return filter_var($this->resolveSiteSetting($site, $key, $default), FILTER_VALIDATE_BOOLEAN);
    }
}
