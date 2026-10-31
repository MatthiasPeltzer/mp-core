<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use GeorgRinger\News\Seo\NewsXmlSitemapDataProvider as GeorgRingerNewsXmlSitemapDataProvider;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Seo\XmlSitemap\AbstractXmlSitemapDataProvider;

/**
 * News sitemap provider that stays inactive until storage PID and detail page are configured.
 */
final class NewsXmlSitemapDataProvider extends GeorgRingerNewsXmlSitemapDataProvider
{
    private bool $disabled = false;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(
        ServerRequestInterface $request,
        string $key,
        array $config = [],
        ?ContentObjectRenderer $cObj = null
    ) {
        if (!$this->isConfigured($config)) {
            $this->disabled = true;
            AbstractXmlSitemapDataProvider::__construct($request, $key, $config, $cObj);

            return;
        }

        parent::__construct($request, $key, $config, $cObj);
    }

    public function getNumberOfPages(): int
    {
        if ($this->disabled) {
            return 0;
        }

        return parent::getNumberOfPages();
    }

    public function getItems(): array
    {
        if ($this->disabled) {
            return [];
        }

        return parent::getItems();
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
