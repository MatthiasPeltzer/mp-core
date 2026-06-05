<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\ViewHelpers\Format;

use Mpc\MpCore\Service\CssColorValidator;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Emits a CSS colour value verbatim if it passes {@see CssColorValidator},
 * otherwise emits an empty string. Use this whenever an admin-supplied colour
 * is interpolated into an inline `<style>` block to prevent CSS-context
 * breakout (e.g. `red; } body { display: none; } a {`).
 *
 * Usage:
 *   <mpc:format.cssColor value="{site.configuration.color-1}" />
 *   {site.configuration.color-1 -> mpc:format.cssColor()}
 */
class CssColorViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    /**
     * The validator only accepts a fixed grammar of safe CSS colour tokens, so
     * HTML-escaping the children would corrupt valid hex/rgb syntax (e.g.
     * `&` cannot appear, but PostCSS-generated values might use `/` in
     * modern `rgb()` notation) for no defensive benefit — the output is
     * dropped into a CSS context, not HTML text.
     */
    protected $escapeChildren = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('value', 'string', 'CSS colour value to validate', false, null);
    }

    public function render(): string
    {
        $value = $this->arguments['value'] ?? $this->renderChildren();
        if (!is_string($value) || $value === '') {
            return '';
        }
        $value = trim($value);
        return CssColorValidator::isValid($value) ? $value : '';
    }
}
