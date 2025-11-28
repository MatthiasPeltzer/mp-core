<?php

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

use TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider;

return [
    // Content Element Icons
    'tx_audio' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Audio.svg',
    ],
    'tx_banner' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Banner.svg',
    ],
    'tx_gallery' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Gallery.svg',
    ],
    'tx_singleteaser' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Singleteaser.svg',
    ],
    'tx_stage' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Stage.svg',
    ],
    'tx_video' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Video.svg',
    ],
    'tx_grid' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Grid.svg',
    ],
    'tx_slider' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Slider.svg',
    ],
    'tx_accordion' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Accordion.svg',
    ],
    'tx_tabs' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Tabs.svg',
    ],
    'typo3-vite-demo-todolist' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/TodoList.svg',
    ],
];

