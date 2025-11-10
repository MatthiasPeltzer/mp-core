<?php

use TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider;

return [
    'tx_stage' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Stage.svg',
    ],
    'tx_singleteaser' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Singleteaser.svg',
    ],
    'tx_banner' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Banner.svg',
    ],
    'tx_slider' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Slider.svg',
    ],
    'tx_video' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Video.svg',
    ],
    'tx_audio' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Audio.svg',
    ],
    'tx_gallery' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Gallery.svg',
    ],
    'tx_container' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Container.svg',
        'spinning' => false,
    ],
    'tx_tabs' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Tabs.svg',
        'spinning' => false,
    ],
    'tx_accordion' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Accordion.svg',
        'spinning' => false,
    ],
    'tx_grid' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Grid.svg',
        'spinning' => false,
    ],
    'tx_frame' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/Frame.svg',
        'spinning' => false,
    ],
    'tx_noframe' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/NoFrame.svg',
        'spinning' => false,
    ],
    'typo3-vite-demo-todolist' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:mp_core/Resources/Public/Icons/TodoList.svg',
    ],
];
