<?php

declare(strict_types=1);

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['banner'] = 'tx_banner';

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:banner.title',
        'value' => 'banner',
        'icon' => 'tx_banner',
        'group' => 'default',
    ];

    $imageBannerPalettes = [
        'image_banner_config' => [
            'showitem' => 'image,--linebreak--',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $imageBannerPalettes;

    $bannerTypes = [
        'banner' =>
            [
                'columnsOverrides' =>
                    [
                        'bodytext' =>
                            [
                                'config' =>
                                    [
                                        'richtextConfiguration' => 'default',
                                        'enableRichtext' => 0,
                                    ],
                            ],
                        'image' =>
                            [
                                'config' =>
                                    [
                                        'maxitems' => 1,
                                        'allowed' => 'png,jpg,jpeg,gif,svg,webp',
                                        'overrideChildTca' => [
                                            'columns' => [
                                                'description' => [
                                                    'config' => [
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                                'link' => [
                                                    'config' => [
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                                'title' => [
                                                    'config' => [
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                                'outline' => [
                                                    'config' => [
                                                        'renderType' => 'passthrough',
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                                'caption' => [
                                                    'config' => [
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                            ],
                    ],
                'showitem' => '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,
            header,
        --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:banner.title,
            --palette--;;image_banner_config,
            grid_bgcolor,
            grid_light,
            --palette--;;link_config,
        --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.appearanceLinks;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
            --palette--;;hidden,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
            categories,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
            rowDescription,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended',
            ],
    ];

    $GLOBALS['TCA']['tt_content']['types'] += $bannerTypes;
})();
