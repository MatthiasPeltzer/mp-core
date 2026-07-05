<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

(static function (): void {
    /**
     * Register Slider
     */
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        (new ContainerConfiguration(
            'ce_slider',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.title',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.elements',
                        'colPos' => 101,
                    ],
                ],
            ]
        ))
            ->setIcon('tx_slider')
            ->setSaveAndCloseInNewContentElementWizard(true)
    );

    $slider = [
        'slider_type' => [
            'config' =>
                [
                    'items' =>
                        [
                            0 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.slide',
                                    'value' => 'slide',
                                ],
                            1 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.fade',
                                    'value' => 'fade',
                                ],
                            2 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.cube',
                                    'value' => 'cube',
                                ],
                            3 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.coverflow',
                                    'value' => 'coverflow',
                                ],
                            4 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.flip',
                                    'value' => 'flip',
                                ],
                            5 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.cards',
                                    'value' => 'cards',
                                ],
                            6 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.type.creative',
                                    'value' => 'creative',
                                ],
                        ],
                    'renderType' => 'selectSingle',
                    'type' => 'select',
                    'behaviour' => [
                        'allowLanguageSynchronization' => true,
                    ],
                ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.slider.type',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.slider.type.description',
        ],
        'slider_slides_per_view' => [
            'config' => [
                'type' => 'number',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.slides_per_view',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.slides_per_view.description',
        ],
        'slider_slides_per_group' => [
            'config' => [
                'type' => 'number',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.slides_per_group',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.slides_per_group.description',
        ],
        'slider_space_between' => [
            'config' => [
                'type' => 'number',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.space_between',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.space_between.description',
        ],
        'slider_loop' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.loop',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.loop.description',
        ],
        'slider_speed' => [
            'config' => [
                'type' => 'number',
                'default' => 300,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.speed',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.speed.description',
        ],
        'slider_autoplay_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_enabled.description',
        ],
        'slider_autoplay_delay' => [
            'config' => [
                'type' => 'number',
                'default' => 3000,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_delay',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_delay.description',
        ],
        'slider_autoplay_disable_on_interaction' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_disable_on_interaction',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.autoplay_disable_on_interaction.description',
        ],
        'slider_navigation_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.navigation_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.navigation_enabled.description',
        ],
        'slider_pagination_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_enabled.description',
        ],
        'slider_pagination_type' => [
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
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_type',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_type.description',
        ],
        'slider_pagination_clickable' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_clickable',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_clickable.description',
            'displayCond' => 'FIELD:slider_pagination_type:=:bullets',
        ],
        'slider_pagination_dynamic_bullets' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_dynamic_bullets',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.pagination_dynamic_bullets.description',
            'displayCond' => 'FIELD:slider_pagination_type:=:bullets',
        ],
        'slider_keyboard_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 1,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.keyboard_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.keyboard_enabled.description',
        ],
        'slider_mousewheel_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.mousewheel_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.mousewheel_enabled.description',
        ],
        'slider_free_mode_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.free_mode_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.free_mode_enabled.description',
        ],
        'slider_zoom_enabled' => [
            'config' => [
                'type' => 'check',
                'default' => 0,
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.zoom_enabled',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.zoom_enabled.description',
        ],
        'slider_breakpoints' => [
            'config' => [
                'type' => 'text',
                'rows' => 5,
                'eval' => 'trim',
                'placeholder' => '{"576": {"slidesPerView": 2}, "992": {"slidesPerView": 3}}',
            ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.breakpoints',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.breakpoints.description',
        ],
    ];

    $sliderPalettes = [
        'slider_config' => [
            'showitem' => 'slider_type,slider_slides_per_view,slider_slides_per_group,slider_space_between,slider_loop,slider_speed',
            'canNotCollapse' => 1,
        ],
        'slider_autoplay' => [
            'showitem' => 'slider_autoplay_enabled,slider_autoplay_delay,slider_autoplay_disable_on_interaction',
            'canNotCollapse' => 1,
        ],
        'slider_navigation' => [
            'showitem' => 'slider_navigation_enabled,slider_pagination_enabled,slider_pagination_type,slider_pagination_clickable,slider_pagination_dynamic_bullets',
            'canNotCollapse' => 1,
        ],
        'slider_advanced' => [
            'showitem' => 'slider_keyboard_enabled,slider_mousewheel_enabled,slider_free_mode_enabled,slider_zoom_enabled,slider_breakpoints',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $sliderPalettes;

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_slider']['showitem'] = '
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
        --palette--;;header_config,subheader,
    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.title,
        --palette--;;slider_config,
        --palette--;;slider_autoplay,
        --palette--;;slider_navigation,
        --palette--;;slider_advanced,
        grid_container,
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
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended;';

    ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $slider
    );
})();
