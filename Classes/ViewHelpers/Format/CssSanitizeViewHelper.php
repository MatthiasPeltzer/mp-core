<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Format;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Sanitizes a CSS string to prevent style-tag breakout and dangerous
 * CSS constructs when injecting admin-provided styles into a <style> block.
 *
 * Usage:
 *   {value -> mpc:format.cssSanitize()}
 *   <mpc:format.cssSanitize value="{site.configuration.styles}" />
 */
class CssSanitizeViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    /**
     * Children carry the raw CSS source; HTML-escaping them before sanitization
     * would corrupt syntax like `&` in selectors and offer no security benefit
     * since the sanitizer's output is dropped into a `<style>` block, not HTML
     * text. The real mitigation is CSP — this ViewHelper is best-effort defense
     * in depth.
     */
    protected $escapeChildren = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('value', 'string', 'The CSS string to sanitize', false, null);
    }

    public function render(): string
    {
        $value = $this->arguments['value'] ?? $this->renderChildren();
        if (!is_string($value) || $value === '') {
            return '';
        }

        return self::stripDangerousConstructs($value);
    }

    /**
     * Strips style-tag breakout sequences and dangerous CSS constructs.
     *
     * Each pattern is re-applied until the string stops changing: a single
     * pass is not enough because overlapping/nested tokens can reconstruct a
     * dangerous sequence after one replacement (e.g. `</sty</stylele>` collapses
     * to `</style>`, and `<scr<scriptipt` to `<script`).
     */
    public static function stripDangerousConstructs(string $value): string
    {
        $patterns = [
            '/<\s*\/\s*style/i' => '',
            '/<\s*script/i' => '',
            '/@import\b/i' => '',
            '/expression\s*\(/i' => '',
            '/javascript\s*:/i' => '',
            '/behavior\s*:/i' => '',
            '/url\s*\(\s*["\']?\s*data\s*:/i' => 'url(',
        ];

        do {
            $previous = $value;
            foreach ($patterns as $pattern => $replacement) {
                $value = (string)preg_replace($pattern, $replacement, $value);
            }
        } while ($value !== $previous);

        return $value;
    }
}
