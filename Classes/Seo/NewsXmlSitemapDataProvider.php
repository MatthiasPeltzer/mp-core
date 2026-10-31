<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use GeorgRinger\News\Seo\NewsXmlSitemapDataProvider as GeorgRingerNewsXmlSitemapDataProvider;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Seo\XmlSitemap\XmlSitemapDataProviderInterface;

/**
 * News sitemap provider that stays inactive until storage PID and detail page are configured.
 */
final class NewsXmlSitemapDataProvider implements XmlSitemapDataProviderInterface
{
    private XmlSitemapDataProviderInterface $delegate;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(
        ServerRequestInterface $request,
        string $key,
        array $config = [],
        ?ContentObjectRenderer $cObj = null
    ) {
        if ($this->isConfigured($config) && class_exists(GeorgRingerNewsXmlSitemapDataProvider::class)) {
            $this->delegate = new GeorgRingerNewsXmlSitemapDataProvider($request, $key, $config, $cObj);
        } else {
            $this->delegate = new EmptyXmlSitemapDataProvider($request, $key, $config, $cObj);
        }
    }

    public function getKey(): string
    {
        return $this->delegate->getKey();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function getItems(): array
    {
        /** @var list<array<string, mixed>> */
        return array_values($this->delegate->getItems());
    }

    public function getLastModified(): int
    {
        return $this->delegate->getLastModified();
    }

    public function getNumberOfPages(): int
    {
        return $this->delegate->getNumberOfPages();
    }

    /**
     * @param array<string, mixed> $config
     */
    private function isConfigured(array $config): bool
    {
        $storagePid = trim((string)($config['pid'] ?? ''));
        $detailPageId = (int)($config['url']['pageId'] ?? 0);

        return $storagePid !== '' && $detailPageId > 0;
    }
}
