<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\Stream;

/**
 * Collapses redundant whitespace in HTML responses produced by the TYPO3
 * frontend so that View-Source no longer shows the indentation Fluid leaves
 * behind. Runs on the response side before
 * `typo3/cms-frontend/content-length-headers`, so the Content-Length header
 * still matches the rewritten body.
 *
 * Content of <pre>, <textarea>, <script>, <style> and <svg> elements as well
 * as HTML comments (incl. TYPO3SEARCH markers and IE conditional comments)
 * is preserved byte-for-byte. Inside the remaining markup, runs of
 * whitespace are collapsed to a single newline (when the run contains a
 * newline) or a single space. As a follow-up pass, single newlines that sit
 * purely between tag boundaries (`>\n<`) are stripped — Fluid template
 * indentation always introduces a newline, so this tightens nav links and
 * similar Fluid output without disturbing author-typed inline spaces such
 * as `<strong>foo</strong> <em>bar</em>` (single space, no newline) in RTE
 * content.
 */
final class HtmlWhitespaceCompressorMiddleware implements MiddlewareInterface
{
    /**
     * Matches blocks whose contents must not be touched.
     *
     * The `s` flag lets `.` cross newlines so multi-line <script>, <style>,
     * <svg> and HTML comments (incl. TYPO3SEARCH markers) are matched as a
     * single unit; the `i` flag tolerates upper-case tag names.
     */
    private const PROTECTED_PATTERN = '#<(pre|textarea|script|svg)\b[^>]*>.*?</\1\s*>|<!--.*?-->#is';

    private const PLACEHOLDER_PREFIX = "\x00MPC_HTMLWS_";
    private const PLACEHOLDER_SUFFIX = "\x00";

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        $contentType = strtolower($response->getHeaderLine('Content-Type'));
        if ($contentType !== '' && !str_starts_with($contentType, 'text/html')) {
            return $response;
        }

        // The PSR-7 stream cast and the subsequent empty-string check below
        // already handle zero-byte bodies, so we deliberately skip the
        // `getSize()` fast path here. `StreamInterface::getSize()` is allowed
        // to return null for non-seekable streams and the TYPO3 Extension
        // Scanner flags every `->getSize()` call as potentially affected by
        // Deprecation #101475 (`ModifyIconForResourcePropertiesEvent`),
        // because it cannot infer the receiver type — avoiding the call
        // sidesteps that false positive without changing behaviour.
        $body = $response->getBody();
        if ($body->isSeekable()) {
            $body->rewind();
        }
        $original = (string)$body;
        if ($original === '') {
            return $response;
        }

        $minified = $this->minify($original);
        if ($minified === $original) {
            return $response;
        }

        $stream = new Stream('php://temp', 'rw');
        $stream->write($minified);
        $stream->rewind();

        return $response->withBody($stream);
    }

    private function minify(string $html): string
    {
        $protected = [];

        $html = preg_replace_callback(
            self::PROTECTED_PATTERN,
            static function (array $matches) use (&$protected): string {
                $key = self::PLACEHOLDER_PREFIX . count($protected) . self::PLACEHOLDER_SUFFIX;
                $protected[] = $matches[0];
                return $key;
            },
            $html
        ) ?? $html;

        $html = preg_replace_callback(
            '/\s+/',
            static fn (array $matches): string => str_contains($matches[0], "\n") ? "\n" : ' ',
            $html
        ) ?? $html;

        // Strip newlines that sit purely between tag boundaries. The
        // null-byte boundary marks where a protected block (script, svg,
        // comment, …) will be re-injected, so newlines adjacent to that
        // marker count as "between tags" too. Only newlines are removed —
        // a single space without a newline (typical of RTE-typed inline
        // text) is left alone.
        $marker = self::PLACEHOLDER_SUFFIX;
        $html = str_replace(
            [">\n<", ">\n" . $marker, $marker . "\n<"],
            ['><', '>' . $marker, $marker . '<'],
            $html
        );

        if ($protected !== []) {
            $prefix = preg_quote(self::PLACEHOLDER_PREFIX, '#');
            $suffix = preg_quote(self::PLACEHOLDER_SUFFIX, '#');
            $html = preg_replace_callback(
                '#' . $prefix . '(\d+)' . $suffix . '#',
                static fn (array $matches): string => $protected[(int)$matches[1]] ?? '',
                $html
            ) ?? $html;
        }

        return $html;
    }
}
