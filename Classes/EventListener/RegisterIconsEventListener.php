<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\EventListener;

use TYPO3\CMS\Core\Core\Event\BootCompletedEvent;
use TYPO3\CMS\Core\Imaging\IconRegistry;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class RegisterIconsEventListener
{
    public function __invoke(BootCompletedEvent $event): void
    {
        /** @var IconRegistry $iconRegistry */
        $iconRegistry = GeneralUtility::makeInstance(IconRegistry::class);
        
        // Register external video file extension
        $iconRegistry->registerFileExtension('externalvideo', 'mimetypes-media-video');
        
        // Register external audio file extension
        $iconRegistry->registerFileExtension('externalaudio', 'mimetypes-media-audio');
    }
}

