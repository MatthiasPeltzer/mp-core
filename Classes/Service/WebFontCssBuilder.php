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
 * Assembles the CSS for editor-managed web fonts: one `@font-face` rule per
 * font face plus a `:root` custom-property mapping per family.
 *
 * This class is the trust boundary for values that end up inside the nonce'd
 * inline `<style>` block emitted by `Resources/Private/Partials/Page/Styles.html`.
 * Every component is either validated against a fixed allow-list (weight, style,
 * font-display, format, css-variable, unicode-range) or aggressively stripped of
 * any character that could break out of the CSS declaration / `url()` / quoted
 * string context (family name, fallback stack, url).
 */
final readonly class WebFontCssBuilder
{
    /**
     * Maps an uploaded font file extension to the `format()` hint required in
     * the `@font-face` `src` descriptor. Doubles as the upload allow-list:
     * faces whose file extension is absent here are dropped.
     *
     * @var array<string, string>
     */
    private const FORMAT_MAP = [
        'woff2' => 'woff2',
    ];

    /**
     * @var list<string>
     */
    private const ALLOWED_WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

    /**
     * @var list<string>
     */
    private const ALLOWED_STYLES = ['normal', 'italic'];

    /**
     * @var list<string>
     */
    private const ALLOWED_DISPLAY = ['auto', 'block', 'swap', 'fallback', 'optional'];

    /**
     * Built-in Bootstrap custom properties a family role maps onto. The current
     * theme overrides `--bs-body-font-family` for body copy and
     * `--bs-font-sans-serif` for headings (see Bootstrap variable cascade).
     *
     * @var array<string, string>
     */
    private const ROLE_VARIABLES = [
        'body' => '--bs-body-font-family',
        'heading' => '--bs-font-sans-serif',
    ];

    /**
     * @param list<array{
     *     name: string,
     *     fallback: string,
     *     role: string,
     *     cssVariable: string,
     *     fontDisplay: string,
     *     faces: list<array{url: string, extension: string, weight: string, style: string, unicodeRange: string}>
     * }> $families
     */
    public function build(array $families): string
    {
        $fontFaceRules = [];
        $rootDeclarations = [];

        foreach ($families as $family) {
            $name = $this->sanitizeFamilyName((string)($family['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $faceRules = $this->buildFaceRules($name, $family['faces'] ?? [], (string)($family['fontDisplay'] ?? 'swap'));
            if ($faceRules === []) {
                // No loadable file means the family name would resolve to
                // nothing in the browser; skip the :root mapping as well.
                continue;
            }

            foreach ($faceRules as $rule) {
                $fontFaceRules[] = $rule;
            }

            $variable = $this->resolveCssVariable($family);
            if ($variable !== null) {
                $fallback = $this->sanitizeFallback((string)($family['fallback'] ?? ''));
                $stack = '"' . $name . '"' . ($fallback !== '' ? ', ' . $fallback : '');
                $rootDeclarations[$variable] = $variable . ': ' . $stack . ';';
            }
        }

        if ($fontFaceRules === []) {
            return '';
        }

        $css = implode("\n", $fontFaceRules);
        if ($rootDeclarations !== []) {
            $css .= "\n:root {\n    " . implode("\n    ", $rootDeclarations) . "\n}";
        }

        return $css;
    }

    /**
     * @param list<array{url: string, extension: string, weight: string, style: string, unicodeRange: string}> $faces
     * @return list<string>
     */
    private function buildFaceRules(string $familyName, array $faces, string $fontDisplay): array
    {
        $display = in_array($fontDisplay, self::ALLOWED_DISPLAY, true) ? $fontDisplay : 'swap';
        $rules = [];

        foreach ($faces as $face) {
            $url = $this->sanitizeUrl((string)($face['url'] ?? ''));
            $format = self::FORMAT_MAP[strtolower((string)($face['extension'] ?? ''))] ?? null;
            if ($url === '' || $format === null) {
                continue;
            }

            $weight = (string)($face['weight'] ?? '400');
            if (!in_array($weight, self::ALLOWED_WEIGHTS, true)) {
                $weight = '400';
            }

            $style = (string)($face['style'] ?? 'normal');
            if (!in_array($style, self::ALLOWED_STYLES, true)) {
                $style = 'normal';
            }

            $declarations = [
                'font-family: "' . $familyName . '"',
                'src: url("' . $url . '") format("' . $format . '")',
                'font-weight: ' . $weight,
                'font-style: ' . $style,
                'font-display: ' . $display,
            ];

            $unicodeRange = $this->sanitizeUnicodeRange((string)($face['unicodeRange'] ?? ''));
            if ($unicodeRange !== '') {
                $declarations[] = 'unicode-range: ' . $unicodeRange;
            }

            $rules[] = '@font-face {' . implode('; ', $declarations) . ';}';
        }

        return $rules;
    }

    /**
     * @param array{role?: string, cssVariable?: string} $family
     */
    private function resolveCssVariable(array $family): ?string
    {
        $role = (string)($family['role'] ?? 'body');
        if (isset(self::ROLE_VARIABLES[$role])) {
            return self::ROLE_VARIABLES[$role];
        }

        if ($role === 'custom') {
            $variable = trim((string)($family['cssVariable'] ?? ''));

            return preg_match('/^--[a-zA-Z0-9-]+$/', $variable) === 1 ? $variable : null;
        }

        return null;
    }

    /**
     * Strips everything that could terminate the quoted `font-family` string or
     * the surrounding declaration / style block.
     */
    private function sanitizeFamilyName(string $value): string
    {
        $value = (string)preg_replace('/[\r\n"\';{}<>()]/', '', $value);

        return trim($value);
    }

    /**
     * The fallback stack may legitimately contain commas, spaces, hyphens and
     * generic family keywords. Strip characters that could break out of the
     * declaration or quoted string; keep single quotes for nested family names.
     */
    private function sanitizeFallback(string $value): string
    {
        $value = (string)preg_replace('/[\r\n";{}<>()]/', '', $value);

        return trim($value);
    }

    /**
     * Accepts a relative or absolute same-origin URL produced by FAL
     * `getPublicUrl()`. Removes any character that could close the `url("...")`
     * function or the declaration.
     */
    private function sanitizeUrl(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        // Reject data: URIs and anything carrying quotes / parens / whitespace
        // that could break the url("...") wrapper.
        if (preg_match('/[\s"\'()<>;{}]/', $value) === 1) {
            return '';
        }
        if (stripos($value, 'data:') === 0 || stripos($value, 'javascript:') === 0) {
            return '';
        }

        return $value;
    }

    /**
     * Validates a CSS `unicode-range` token list (e.g. `U+0-7F, U+1E00-1EFF`).
     * Returns an empty string when the value does not match the grammar.
     */
    private function sanitizeUnicodeRange(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $pattern = '/^[Uu]\+[0-9A-Fa-f?]{1,6}(-[0-9A-Fa-f]{1,6})?(\s*,\s*[Uu]\+[0-9A-Fa-f?]{1,6}(-[0-9A-Fa-f]{1,6})?)*$/';

        return preg_match($pattern, $value) === 1 ? $value : '';
    }
}
