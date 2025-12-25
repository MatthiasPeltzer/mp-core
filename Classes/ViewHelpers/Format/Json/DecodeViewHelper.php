<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Format\Json;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Exception;

/**
 * Class DecodeViewHelper
 */
class DecodeViewHelper extends AbstractViewHelper
{
    /**
     * @var bool
     */
    protected $escapeOutput = false;

    /**
     * @var bool
     */
    protected $escapeChildren = false;

    /**
     * Initialize arguments.
     */
    public function initializeArguments(): void
    {
        $this->registerArgument('json', 'string', 'The JSON string to decode', true);
    }

    /**
     * Render method.
     *
     * @return mixed
     */
    public function render(): mixed
    {
        $json = $this->arguments['json'];

        if ($json === '') {
            return [];
        }

        try {
            return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new Exception('The provided argument is invalid JSON.', 1358440054, $e);
        }
    }
}
