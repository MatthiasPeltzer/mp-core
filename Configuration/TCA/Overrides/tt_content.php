<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $linkColumns = [
        'tx_link_switch' =>
            [
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_switch',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_switch.description',
            'onChange' => 'reload',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_switch',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'tx_link' =>
            [
                'config' =>
                    [
                        'allowedTypes' => [
                            '0' => 'page',
                            '1' => 'file',
                            '2' => 'url',
                            '3' => 'record',
                        ],
                        'appearance' => [
                            'browserTitle' => 'Link',
                        ],
                        'type' => 'link',
                        'wizards' => [
                            'link' => [
                                'icon' => 'actions-wizard-link',
                            ],
                        ],
                    ],
                'exclude' => '0',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link',
            ],
        'tx_link_layout' =>
            [
                'config' =>
                    [
                        'items' =>
                            [
                                0 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style.default',
                                        'value' => '',
                                    ],
                                1 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.0',
                                        'value' => 'btn btn-primary',
                                    ],
                                2 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.1',
                                        'value' => 'btn btn-secondary',
                                    ],
                                3 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.2',
                                        'value' => 'btn btn-tertiary',
                                    ],
                                4 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.3',
                                        'value' => 'btn btn-quaternary',
                                    ],
                                5 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.4',
                                        'value' => 'internal-link',
                                    ],
                                6 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.5',
                                        'value' => 'external-link',
                                    ],
                                7 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout.I.6',
                                        'value' => 'download',
                                    ],
                            ],
                        'renderType' => 'selectSingle',
                        'type' => 'select',
                    ],
                'displayCond' => 'FIELD:tx_link_switch:=:1',
                'exclude' => '0',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_layout',
            ],
        'tx_link_text' =>
            [
                'config' =>
                    [
                        'eval' => 'trim',
                        'type' => 'input',
                    ],
                'displayCond' => 'FIELD:tx_link_switch:=:1',
                'exclude' => '0',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_text',
            ],
        'tx_link_position' =>
            [
                'config' =>
                    [
                        'items' =>
                            [
                                0 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style.default',
                                        'value' => '',
                                    ],
                                1 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_position.I.0',
                                        'value' => 'btn-center',
                                    ],
                                2 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_position.I.1',
                                        'value' => 'btn-left',
                                    ],
                                3 =>
                                    [
                                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_position.I.2',
                                        'value' => 'btn-right',
                                    ],
                            ],
                        'renderType' => 'selectSingle',
                        'type' => 'select',
                    ],
                'exclude' => '0',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_link_position',
            ],
    ];
    ExtensionManagementUtility::addTCAcolumns('tt_content', $linkColumns);

    $linkPalettes = [
        'link_config' => [
            'showitem' => 'tx_link,tx_link_position,--linebreak--,tx_link_switch,--linebreak--,tx_link_text,tx_link_layout', 'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $linkPalettes;

    /***************
     * Register Vue TodoList as Content Element (CType)
     * This creates a standalone content element in Special Elements
     */
    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist',
        'value' => 'mpcore_todolist',
        'icon' => 'typo3-vite-demo-todolist',
        'group' => 'special',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist.description',
    ];

// Register icon for the CType in list view
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['mpcore_todolist'] = 'typo3-vite-demo-todolist';

// Add FlexForm field to pi_flexform column for this CType
    ExtensionManagementUtility::addPiFlexFormValue(
        '*',
        'FILE:EXT:mp_core/Configuration/FlexForms/TodoList.xml',
        'mpcore_todolist'
    );

// Define showitem for the plugin CType
    $GLOBALS['TCA']['tt_content']['types']['mpcore_todolist'] = [
        'showitem' => '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;;general,
            --palette--;;headers,
        --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:flexform.todolist.tab.settings,
            pi_flexform,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:appearance,
            --palette--;;frames,
            --palette--;;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
            --palette--;;hidden,
            --palette--;;access,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
            rowDescription,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
    ',
    ];



})();

$GLOBALS['TCA']['tt_content']['columns']['header_layout']['config']['default'] = '2';
