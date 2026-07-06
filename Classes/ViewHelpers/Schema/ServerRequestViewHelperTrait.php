<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Schema;

use Psr\Http\Message\ServerRequestInterface;

/**
 * Resolves the current PSR-7 request from Fluid rendering context or TYPO3 globals.
 */
trait ServerRequestViewHelperTrait
{
    private function getServerRequest(): ?ServerRequestInterface
    {
        $renderingContext = $this->renderingContext;
        if ($renderingContext === null) {
            return $this->getServerRequestFallback();
        }

        if (!$renderingContext->hasAttribute(ServerRequestInterface::class)) {
            return $this->getServerRequestFallback();
        }

        $request = $renderingContext->getAttribute(ServerRequestInterface::class);

        return $request instanceof ServerRequestInterface ? $request : $this->getServerRequestFallback();
    }

    private function getServerRequestFallback(): ?ServerRequestInterface
    {
        $fallback = $GLOBALS['TYPO3_REQUEST'] ?? null;

        return $fallback instanceof ServerRequestInterface ? $fallback : null;
    }
}
