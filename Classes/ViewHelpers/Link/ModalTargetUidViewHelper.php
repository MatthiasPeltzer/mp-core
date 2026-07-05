<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Link;

use TYPO3\CMS\Core\LinkHandling\LinkService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Resolves a tt_content UID from a TYPO3 record link (for modal targets).
 *
 * Example:
 *   <mpc:link.modalTargetUid link="{data.tx_link}" />
 */
class ModalTargetUidViewHelper extends AbstractViewHelper
{
    public function initializeArguments(): void
    {
        parent::initializeArguments();
        $this->registerArgument('link', 'string', 'TYPO3 link field value pointing to a tt_content record', true);
    }

    public function render(): int
    {
        $link = trim((string)$this->arguments['link']);
        if ($link === '') {
            return 0;
        }

        try {
            $linkService = GeneralUtility::makeInstance(LinkService::class);
            $data = $linkService->resolve($link);
            if (($data['type'] ?? '') === 'record' && ($data['identifier'] ?? '') === 'tt_content') {
                return (int)($data['uid'] ?? 0);
            }
        } catch (\Throwable) {
            return 0;
        }

        return 0;
    }
}
