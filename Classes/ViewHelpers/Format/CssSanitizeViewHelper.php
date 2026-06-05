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

        $value = (string)preg_replace('/<\s*\/\s*style/i', '', $value);
        $value = (string)preg_replace('/<\s*script/i', '', $value);
        $value = (string)preg_replace('/@import\b/i', '', $value);
        $value = (string)preg_replace('/expression\s*\(/i', '', $value);
        $value = (string)preg_replace('/javascript\s*:/i', '', $value);
        $value = (string)preg_replace('/behavior\s*:/i', '', $value);
        $value = (string)preg_replace('/url\s*\(\s*["\']?\s*data\s*:/i', 'url(', $value);

        return $value;
    }
}
