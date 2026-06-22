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
    private function matchesSitePath(ServerRequestInterface $request, Site $site, string $expectedPath): bool
    {
        $expectedPath = trim($expectedPath, '/');
        $requestPath = $this->resolveSiteRelativePath($request, $site);

        return $requestPath === $expectedPath;
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
