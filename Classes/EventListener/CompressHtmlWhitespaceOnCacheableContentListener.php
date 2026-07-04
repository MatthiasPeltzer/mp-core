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

/**
 * Minifies HTML while it is first generated, before TYPO3 writes the page
 * cache row. Cached responses therefore already contain compressed markup.
 *
 * The {@see AfterCacheableContentIsGeneratedEvent} API changed between the two
 * supported core versions, so both are handled via runtime capability probing:
 *
 * - TYPO3 v14 exposes the generated markup on the event itself
 *   (`getContent()` / `setContent()`) and the HTTP content type through the
 *   `frontend.page.parts` request attribute.
 * - TYPO3 v13 carries the markup on the TypoScriptFrontendController
 *   (`$controller->content`); its content type is not publicly readable, so
 *   HTML is detected by sniffing the document prologue instead.
 *
 * Capability detection (`method_exists()` / `property_exists()`) is used rather
 * than a hard version switch so the listener compiles and statically analyses
 * cleanly against whichever single core version happens to be installed.
 */
final readonly class CompressHtmlWhitespaceOnCacheableContentListener
{
    public function __construct(
        private HtmlWhitespaceCompressor $htmlWhitespaceCompressor,
    ) {}

    #[AsEventListener('mpc/mp-core/compress-html-whitespace-on-cacheable-content')]
    public function __invoke(AfterCacheableContentIsGeneratedEvent $event): void
    {
        $this->dispatch($event);
    }

    /**
     * Probes the event for the API of the installed core version. The parameter
     * is typed as {@see object} on purpose: it keeps the version-specific method
     * and property accesses behind `method_exists()`/`property_exists()` guards
     * that static analysis can narrow, instead of resolving them against a
     * single concrete event class.
     */
    private function dispatch(object $event): void
    {
        // TYPO3 v14: markup and content type are reachable from the event.
        if (method_exists($event, 'getContent')
            && method_exists($event, 'setContent')
            && method_exists($event, 'getRequest')
        ) {
            $this->compressFromEvent($event);
            return;
        }

        // TYPO3 v13: markup lives on the TypoScriptFrontendController.
        if (method_exists($event, 'getController')) {
            $this->compressFromController($event);
        }
    }

    private function compressFromEvent(object $event): void
    {
        if (!method_exists($event, 'getRequest')
            || !method_exists($event, 'getContent')
            || !method_exists($event, 'setContent')
        ) {
            return;
        }

        $request = $event->getRequest();
        if (!is_object($request) || !method_exists($request, 'getAttribute')) {
            return;
        }

        $pageParts = $request->getAttribute('frontend.page.parts');
        if (!is_object($pageParts) || !method_exists($pageParts, 'getHttpContentType')) {
            return;
        }

        if (!$this->htmlWhitespaceCompressor->isHtmlContentType((string)$pageParts->getHttpContentType())) {
            return;
        }

        $content = $event->getContent();
        if (!is_string($content) || $content === '') {
            return;
        }

        $event->setContent($this->htmlWhitespaceCompressor->compress($content));
    }

    private function compressFromController(object $event): void
    {
        if (!method_exists($event, 'getController')) {
            return;
        }

        $controller = $event->getController();
        if (!is_object($controller) || !property_exists($controller, 'content')) {
            return;
        }

        $content = $controller->content;
        if (!is_string($content) || $content === '') {
            return;
        }

        // The controller's content type is protected with no public accessor in
        // v13, so restrict compression to documents that look like HTML.
        if (!$this->looksLikeHtml($content)) {
            return;
        }

        $controller->content = $this->htmlWhitespaceCompressor->compress($content);
    }

    private function looksLikeHtml(string $content): bool
    {
        $head = strtolower(substr(ltrim($content), 0, 1024));

        return str_contains($head, '<!doctype html') || str_contains($head, '<html');
    }
}
