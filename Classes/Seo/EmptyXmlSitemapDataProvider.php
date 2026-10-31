<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Seo\XmlSitemap\AbstractXmlSitemapDataProvider;

/**
 * No-op sitemap provider (zero URLs).
 */
final class EmptyXmlSitemapDataProvider extends AbstractXmlSitemapDataProvider
{
    /**
     * @param array<string, mixed> $config
     */
    public function __construct(
        ServerRequestInterface $request,
        string $key,
        array $config = [],
        ?ContentObjectRenderer $cObj = null
    ) {
        parent::__construct($request, $key, $config, $cObj);
    }
}
