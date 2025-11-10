<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['gallery'] = 'tx_gallery';

    $tempGalleryColumns = [
        'gallery_layout' =>
            [
                'config' =>
                    [
                        'items' =>
                            [
                                0 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.0',
                                        'value' => 'gallery-single',
                                    ],
                                1 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.1',
                                        'value' => 'gallery-tiles',
                                    ],
                                2 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.2',
                                        'value' => 'gallery-slider',
                                    ],
                                3 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.3',
                                        'value' => 'gallery-thumbs',
                                    ],
                            ],
                        'renderType' => 'selectSingle',
                        'type' => 'select',
                    ],
                'exclude' => '0',
                'onChange' => 'reload',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout',
                'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.description',
            ],
        'gallery_columns' =>
            [
                'config' =>
                    [
                        'items' =>
                            [
                                0 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.onecol',
                                        'value' => '1',
                                    ],
                                1 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.twocol',
                                        'value' => '2',
                                    ],
                                2 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.threecol',
                                        'value' => '3',
                                    ],
                                3 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.fourcol',
                                        'value' => '4',
                                    ],
                            ],
                        'renderType' => 'selectSingle',
                        'type' => 'select',
                    ],
                'exclude' => '1',
                'displayCond' => 'FIELD:gallery_layout:=:gallery-slider',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_columns',
                'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_columns.description',
            ],
    ];

    ExtensionManagementUtility::addTCAcolumns('tt_content', $tempGalleryColumns);

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.div._gallery_',
        '--div--',
    ];

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.gallery',
        'gallery',
        'tx_gallery',
        'default',
    ];

    $galleryPositionPalettes = [
        'galleryposition_config' => [
            'showitem' => 'gallery_layout,gallery_columns', 'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $galleryPositionPalettes;

    $galleryTypes = [
        'gallery' =>
            [
                'columnsOverrides' =>
                    [
                        'bodytext' =>
                            [
                                'config' =>
                                    [
                                        'richtextConfiguration' => 'default',
                                        'enableRichtext' => 1,
                                    ],
                            ],
                        'image' =>
                            [
                                'config' =>
                                    [
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
                      --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
                      --palette--;;header_config,subheader,bodytext,
                  --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.gallery,
                      --palette--;;galleryposition_config,image,
                  --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
                      --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames,
                      --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.appearanceLinks;appearanceLinks,
                  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
                      --palette--;;language,
                  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                      --palette--;;hidden,
                      --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
                  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
                  --div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:sys_category.tabs.category,categories,
                  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,rowDescription,
                  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended
              ',
            ],
    ];

    $GLOBALS['TCA']['tt_content']['types'] += $galleryTypes;
})();
