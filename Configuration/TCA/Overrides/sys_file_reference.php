<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $newColumns = [
        'outline' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.outline',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
        ],
        'allow_download' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.allow_download',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
        ],
        'tx_lang_code' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_lang_code',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'max' => 10,
                'eval' => 'trim',
                'placeholder' => 'de',
            ],
        ],
        'tx_track_kind' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind.captions', 'captions'],
                    ['LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind.subtitles', 'subtitles'],
                    ['LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind.descriptions', 'descriptions'],
                    ['LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind.chapters', 'chapters'],
                    ['LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_track_kind.metadata', 'metadata'],
                ],
                'default' => 'captions',
            ],
        ],
        'tx_quality_label' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.tx_quality_label',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'max' => 50,
                'eval' => 'trim',
                'placeholder' => '1080p, 720p, High, Low',
            ],
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns('sys_file_reference', $newColumns);

    ExtensionManagementUtility::addFieldsToPalette(
        'sys_file_reference',
        'imageoverlayPalette',
        'outline,allow_download',
        'after:title'
    );

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addFieldsToPalette(
        'sys_file_reference',
        'imageoverlayPalette',
        'caption',
        'after:title'
    );
    
    // Define palette for VTT files
    $GLOBALS['TCA']['sys_file_reference']['palettes']['vttFilePalette'] = [
        'showitem' => 'title,--linebreak--,tx_lang_code,tx_track_kind',
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.palette.vttFilePalette',
    ];
})();
