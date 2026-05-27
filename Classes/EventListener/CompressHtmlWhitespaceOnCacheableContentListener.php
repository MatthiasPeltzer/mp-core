<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\EventListener;

use Mpc\MpCore\Service\HtmlWhitespaceCompressor;
use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Frontend\Event\AfterCacheableContentIsGeneratedEvent;
use TYPO3\CMS\Frontend\Page\PageParts;

/**
 * Minifies HTML while it is first generated, before TYPO3 writes the page
 * cache row. Cached responses therefore already contain compressed markup.
 */
final readonly class CompressHtmlWhitespaceOnCacheableContentListener
{
    public function __construct(
        private HtmlWhitespaceCompressor $htmlWhitespaceCompressor,
    ) {}

    #[AsEventListener('mpc/mp-core/compress-html-whitespace-on-cacheable-content')]
    public function __invoke(AfterCacheableContentIsGeneratedEvent $event): void
    {
        $request = $event->getRequest();
        $pageParts = $request->getAttribute('frontend.page.parts');
        if (!$pageParts instanceof PageParts) {
            return;
        }

        if (!$this->htmlWhitespaceCompressor->isHtmlContentType($pageParts->getHttpContentType())) {
            return;
        }

        $content = $event->getContent();
        if ($content === '') {
            return;
        }

        $event->setContent($this->htmlWhitespaceCompressor->compress($content));
    }
}
