<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $newColumns = [
        'outline' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.outline',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
        ],
        'allow_download' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_reference.allow_download',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
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
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
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
})();
