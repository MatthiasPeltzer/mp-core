<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['gallery'] = 'tx_gallery';

    $tempGalleryColumns = [
        // Layout selection
        'gallery_layout' => [
            'config' => [
                'items' => [
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.0', 'value' => 'gallery-single'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.1', 'value' => 'gallery-tiles'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.2', 'value' => 'gallery-slider'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.I.3', 'value' => 'gallery-thumbs'],
                ],
                'renderType' => 'selectSingle',
                'type' => 'select',
                'behaviour' => ['allowLanguageSynchronization' => true],
            ],
            'exclude' => false,
            'onChange' => 'reload',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_layout.description',
        ],

        // Slides per view (gallery-slider only)
        'gallery_columns' => [
            'config' => [
                'items' => [
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.onecol', 'value' => '1'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.twocol', 'value' => '2'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.threecol', 'value' => '3'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.fourcol', 'value' => '4'],
                ],
                'renderType' => 'selectSingle',
                'type' => 'select',
                'behaviour' => ['allowLanguageSynchronization' => true],
            ],
            'exclude' => true,
            'displayCond' => 'FIELD:gallery_layout:=:gallery-slider',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_columns',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.gallery_columns.description',
        ],

        // =============================================================================
        // SWIPER OPTIONS (gallery-slider and gallery-thumbs)
        // =============================================================================

        // Space between slides
        'gallery_space_between' => [
            'config' => [
                'type' => 'number',
                'size' => 5,
                'default' => 10,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.space_between',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.space_between.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Loop
        'gallery_loop' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.loop',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.loop.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Speed
        'gallery_speed' => [
            'config' => [
                'type' => 'number',
                'size' => 5,
                'default' => 300,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.speed',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.speed.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Navigation enabled
        'gallery_navigation_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.navigation_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.navigation_enabled.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Pagination enabled
        'gallery_pagination_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_enabled.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Pagination type
        'gallery_pagination_type' => [
            'config' => [
                'items' => [
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_type.bullets', 'value' => 'bullets'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_type.fraction', 'value' => 'fraction'],
                    ['label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_type.progressbar', 'value' => 'progressbar'],
                ],
                'renderType' => 'selectSingle',
                'type' => 'select',
                'default' => 'bullets',
            ],
            'onChange' => 'reload',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_type',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_type.description',
            'displayCond' => [
                'OR' => [
                    'FIELD:gallery_layout:=:gallery-slider',
                    'FIELD:gallery_layout:=:gallery-thumbs',
                ],
            ],
        ],

        // Pagination clickable (only for bullets)
        'gallery_pagination_clickable' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_clickable',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_clickable.description',
            'displayCond' => [
                'AND' => [
                    'OR' => [
                        'FIELD:gallery_layout:=:gallery-slider',
                        'FIELD:gallery_layout:=:gallery-thumbs',
                    ],
                    'FIELD:gallery_pagination_type:=:bullets',
                ],
            ],
        ],

        // Pagination dynamic bullets (only for bullets)
        'gallery_pagination_dynamic_bullets' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_dynamic_bullets',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.pagination_dynamic_bullets.description',
            'displayCond' => [
                'AND' => [
                    'OR' => [
                        'FIELD:gallery_layout:=:gallery-slider',
                        'FIELD:gallery_layout:=:gallery-thumbs',
                    ],
                    'FIELD:gallery_pagination_type:=:bullets',
                ],
            ],
        ],

        // =============================================================================
        // AUTOPLAY OPTIONS (gallery-slider only)
        // =============================================================================

        'gallery_autoplay_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.autoplay_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.autoplay_enabled.description',
            'displayCond' => 'FIELD:gallery_layout:=:gallery-slider',
        ],

        'gallery_autoplay_delay' => [
            'config' => [
                'type' => 'number',
                'size' => 5,
                'default' => 3000,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.autoplay_delay',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.autoplay_delay.description',
            'displayCond' => 'FIELD:gallery_layout:=:gallery-slider',
        ],

        // =============================================================================
        // THUMBS OPTIONS (gallery-thumbs only)
        // =============================================================================

        'gallery_thumbs_per_view' => [
            'config' => [
                'items' => [
                    ['label' => '3', 'value' => '3'],
                    ['label' => '4', 'value' => '4'],
                    ['label' => '5', 'value' => '5'],
                    ['label' => '6', 'value' => '6'],
                ],
                'renderType' => 'selectSingle',
                'type' => 'select',
                'default' => '4',
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.thumbs_per_view',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.thumbs_per_view.description',
            'displayCond' => 'FIELD:gallery_layout:=:gallery-thumbs',
        ],

        'gallery_thumbs_space_between' => [
            'config' => [
                'type' => 'number',
                'size' => 5,
                'default' => 10,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.thumbs_space_between',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.thumbs_space_between.description',
            'displayCond' => 'FIELD:gallery_layout:=:gallery-thumbs',
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns('tt_content', $tempGalleryColumns);

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.div._gallery_',
        'value' => '--div--',
    ];

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.gallery',
        'value' => 'gallery',
        'icon' => 'tx_gallery',
        'group' => 'default',
    ];

    $galleryPositionPalettes = [
        'galleryposition_config' => [
            'showitem' => 'gallery_layout,gallery_columns',
            'canNotCollapse' => 1,
        ],
        'gallery_swiper_basic' => [
            'showitem' => 'gallery_space_between,gallery_speed,gallery_loop',
            'canNotCollapse' => 1,
        ],
        'gallery_swiper_navigation' => [
            'showitem' => 'gallery_navigation_enabled,gallery_pagination_enabled,gallery_pagination_type,gallery_pagination_clickable,gallery_pagination_dynamic_bullets',
            'canNotCollapse' => 1,
        ],
        'gallery_swiper_autoplay' => [
            'showitem' => 'gallery_autoplay_enabled,gallery_autoplay_delay',
            'canNotCollapse' => 1,
        ],
        'gallery_swiper_thumbs' => [
            'showitem' => 'gallery_thumbs_per_view,gallery_thumbs_space_between',
            'canNotCollapse' => 1,
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
                      --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,
                      header_kicker,
                      header,
                      --palette--;;header_config,
                      subheader,
                      bodytext,
                  --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.gallery,
                      --palette--;;galleryposition_config,
                      --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.swiper_basic;gallery_swiper_basic,
                      --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.swiper_navigation;gallery_swiper_navigation,
                      --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.swiper_autoplay;gallery_swiper_autoplay,
                      --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:gallery.swiper_thumbs;gallery_swiper_thumbs,
                      image,
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

    $GLOBALS['TCA']['tt_content']['types'] += $galleryTypes;
})();
