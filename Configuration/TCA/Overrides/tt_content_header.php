<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $headerIntext = [
        'tx_header_inside' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_position.inside.label',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_position.inside',
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
        $headerIntext
    );

    $headerStyle = [
        'tx_header_style' => [
            'config' => [
                'items' =>
                    [
                        0 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style.default',
                                'value' => '',
                            ],
                        1 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h1',
                                'value' => 'h1',
                            ],
                        2 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h2',
                                'value' => 'h2',
                            ],
                        3 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h3',
                                'value' => 'h3',
                            ],
                        4 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h4',
                                'value' => 'h4',
                            ],
                        5 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h5',
                                'value' => 'h5',
                            ],

                        6 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h6',
                                'value' => 'h6',
                            ],
                    ],
                'renderType' => 'selectSingle',
                'type' => 'select',
            ],
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style',
        ],
        'header_subpages' => [
            'config' => [
                'items' =>
                    [
                        0 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_style.default',
                                'value' => '',
                            ],
                        1 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h2',
                                'value' => 'h2',
                            ],
                        2 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h3',
                                'value' => 'h3',
                            ],
                        3 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h4',
                                'value' => 'h4',
                            ],
                        4 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h5',
                                'value' => 'h5',
                            ],
                        5 =>
                            [
                                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:header.h6',
                                'value' => 'h6',
                            ],
                    ],
                'renderType' => 'selectSingle',
                'type' => 'select',
            ],
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_subpages',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_subpages.description',
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $headerStyle
    );

    ExtensionManagementUtility::addFieldsToPalette(
        'tt_content',
        'headers',
        'tx_header_style,tx_header_inside',
        'after:header_position'
    );

    $headerKicker = [
        'header_kicker' => [
            'l10n_mode' => 'prefixLangTitle',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_position.kicker.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.header_position.kicker.description',
            'config' => [
                'type' => 'input',
                'size' => 50,
                'max' => 255,
            ],
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $headerKicker
    );

    ExtensionManagementUtility::addFieldsToPalette(
        'tt_content',
        'headers',
        'header_kicker, --linebreak--',
        'before:header'
    );

    $headerPalettes = [
        'header_config' => [
            'showitem' => 'header_layout,header_position,tx_header_style,tx_header_inside', 'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $headerPalettes;
})();
