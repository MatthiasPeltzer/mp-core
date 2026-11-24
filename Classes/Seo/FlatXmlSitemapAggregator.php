<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Seo\XmlSitemap\XmlSitemapDataProviderInterface;

/**
 * Merges all configured XML sitemap providers into one URL list (pages + news + …).
 */
final class FlatXmlSitemapAggregator
{
    /**
     * @param array<string, mixed> $configConfiguration
     *
     * @return list<array<string, mixed>>
     */
    public function collectItems(
        ServerRequestInterface $request,
        array $configConfiguration,
        string $sitemapType = 'xmlSitemap'
    ): array {
        $merged = [];
        $seenLocations = [];

        foreach ($configConfiguration[$sitemapType]['sitemaps'] ?? [] as $sitemapName => $sitemapConfig) {
            if (!is_string($sitemapName)) {
                continue;
            }

            $sitemapProvider = $sitemapConfig['provider'] ?? null;
            if (!is_string($sitemapProvider)
                || !class_exists($sitemapProvider)
                || !is_subclass_of($sitemapProvider, XmlSitemapDataProviderInterface::class)
            ) {
                continue;
            }

            $providerConfig = $sitemapConfig['config'] ?? [];
            /** @var XmlSitemapDataProviderInterface $counter */
            $counter = GeneralUtility::makeInstance($sitemapProvider, $request, $sitemapName, $providerConfig);
            $numberOfPages = $counter->getNumberOfPages();

            for ($page = 0; $page < $numberOfPages; $page++) {
                $providerRequest = $this->withSitemapPagination($request, $sitemapName, $page);
                /** @var XmlSitemapDataProviderInterface $provider */
                $provider = GeneralUtility::makeInstance($sitemapProvider, $providerRequest, $sitemapName, $providerConfig);

                foreach ($provider->getItems() as $item) {
                    $location = trim((string)($item['loc'] ?? ''));
                    if ($location === '' || isset($seenLocations[$location])) {
                        continue;
                    }
                    $seenLocations[$location] = true;
                    $merged[] = $item;
                }
            }
        }

        return $merged;
    }

    private function withSitemapPagination(
        ServerRequestInterface $request,
        string $sitemapName,
        int $page
    ): ServerRequestInterface {
        $queryParams = $request->getQueryParams();
        $seoParams = $queryParams['tx_seo'] ?? [];
        if (!is_array($seoParams)) {
            $seoParams = [];
        }
        $seoParams['sitemap'] = $sitemapName;
        $seoParams['page'] = $page;
        $queryParams['tx_seo'] = $seoParams;

        return $request->withQueryParams($queryParams);
    }
}
