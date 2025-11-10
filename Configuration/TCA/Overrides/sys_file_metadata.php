<?php

declare(strict_types=1);

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['sys_file_metadata']['columns']['description']['config']['enableRichtext'] = true;

    $newColumns = [
        'is_accessible' => [
            'exclude' => true,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_metadata.is_accessible.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:sys_file_metadata.is_accessible.description',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
        ],
    ];

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('sys_file_metadata', $newColumns);
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addFieldsToPalette(
        'sys_file_metadata',
        '25',
        'is_accessible',
        'after:caption'
    );
})();
