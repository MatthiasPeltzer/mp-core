<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Service;

/**
 * Collapses redundant whitespace in HTML so that View Source no longer shows
 * the indentation Fluid leaves behind.
 *
 * Content of <pre>, <textarea>, <script>, <style>, <svg> elements as well
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
final class HtmlWhitespaceCompressor
{
    /**
     * Matches blocks whose contents must not be touched.
     *
     * The `s` flag lets `.` cross newlines so multi-line <script>, <style>,
     * <svg> and HTML comments (incl. TYPO3SEARCH markers) are matched as a
     * single unit; the `i` flag tolerates upper-case tag names.
     */
    private const PROTECTED_PATTERN = '#<(pre|textarea|script|style|svg)\b[^>]*>.*?</\1\s*>|<!--.*?-->#is';

    private const PLACEHOLDER_PREFIX = "\x00MPC_HTMLWS_";
    private const PLACEHOLDER_SUFFIX = "\x00";

    public function compress(string $html): string
    {
        return $this->minify($html);
    }

    public function isHtmlContentType(string $contentType): bool
    {
        $contentType = strtolower(trim(explode(';', $contentType, 2)[0]));

        return $contentType === '' || $contentType === 'text/html';
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
