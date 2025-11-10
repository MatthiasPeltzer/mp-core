<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

(static function (): void {
    /**
     * Register accordion
     */
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        new ContainerConfiguration(
            'ce_accordion',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.title',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:content',
                        'colPos' => 101,
                        'allowed' => ['CType' => 'header, text, textpic, ce_accordion, ce_container'],
                    ],
                ],
            ]
        )
        ->setIcon('tx_accordion')
        ->setSaveAndCloseInNewContentElementWizard(true)
    );

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_accordion']['showitem'] = '
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
        --palette--;;header_config,subheader,
    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.title,container_accordion_type,container_headline,container_accordion_toggle_all,container_accordion_toggle,container_accordion_open,grid_container,
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
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended;'
    ;

    $accordionOpen = [
        'container_accordion_type' => [
            'config' => [
                'items' =>
                    [
                        0 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.type.bootstrap',
                                'value' => '1',
                            ],
                        1 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.type.native',
                                'value' => '2',
                            ],
                    ],
                'renderType' => 'selectSingle',
                'type' => 'select',
            ],
            'exclude' => '0',
            'onChange' => 'reload',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.type.label',
        ],
        'container_headline' => [
            'config' => [
                'items' =>
                    [
                        0 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style.default',
                                'value' => '1',
                            ],
                        1 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header_layout.2',
                                'value' => '2',
                            ],
                        2 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header_layout.3',
                                'value' => '3',
                            ],
                        3 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header_layout.4',
                                'value' => '4',
                            ],
                        4 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header_layout.5',
                                'value' => '5',
                            ],
                        5 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header_layout.6',
                                'value' => '6',
                            ],
                    ],
                'renderType' => 'selectSingle',
                'type' => 'select',
            ],
            'displayCond' => 'FIELD:container_accordion_type:=:1',
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style',
        ],
        'container_accordion_toggle' => [
            'exclude' => 1,
            'onChange' => 'reload',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.label.onload',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.description.onload',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.label.onload',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'container_accordion_open' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.label.open',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.description.open',
            'config' => [
                'type' => 'input',
                'size' => 1,
                'eval' => 'trim,number',
                'range' => [
                    'lower' => 1,
                    'upper' => 50,
                ],
                'default' => 1,
                'slider' => [
                    'step' => 1,
                    'width' => 200,
                ],
            ],
            'displayCond' => 'FIELD:container_accordion_toggle:=:1',
        ],
        'container_accordion_toggle_all' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.label.onloadall',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.description.onloadall',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:accordion.label.onloadall',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $accordionOpen
    );

    ExtensionManagementUtility::addFieldsToPalette(
        'tt_content',
        'container',
        'container_accordion_toggle, container_accordion_open, --linebreak--'
    );
})();
