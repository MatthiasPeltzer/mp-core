<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') || die();

(static function (): void {
    /**
     * Register Slider
     */
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        new ContainerConfiguration(
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
        )
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
                        ],
                    'renderType' => 'selectSingle',
                    'type' => 'select',
                ],
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.slider.type',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.slider.type.description',
        ],
    ];

    $sliderPalettes = [
        'slider_config' => [
            'showitem' => 'slider_type,grid_columns', 'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $sliderPalettes;

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_slider']['showitem'] = '
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
        --palette--;;header_config,subheader,
    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:slider.title,
        --palette--;;slider_config,grid_container,
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

    ExtensionManagementUtility::addFieldsToPalette(
        'tt_content',
        'container',
        'slider'
    );
})();
