<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Format\Json;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Exception;

/**
 * Decodes a JSON string into a PHP array.
 *
 * Note: Output escaping is disabled because this ViewHelper returns an array.
 * Consumers MUST escape individual values when rendering them in HTML.
 */
class DecodeViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    protected $escapeChildren = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('json', 'string', 'The JSON string to decode', true);
    }

    public function render(): mixed
    {
        $json = $this->arguments['json'];

        if ($json === '' || $json === null) {
            return [];
        }

        try {
            return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new Exception('The provided argument is invalid JSON.', 1358440054, $e);
        }
    }
}
