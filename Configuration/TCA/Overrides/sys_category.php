<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['pages']['columns']['mainCategory'] = [
        'config' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.MainCategory.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.MainCategory.description',
            'type' => 'category',
            'relationship' => 'oneToOne',
            'foreign_table' => 'sys_category'
        ]
    ];
    ExtensionManagementUtility::addToAllTCAtypes('pages', 'mainCategory, categories','', 'before:categories');
})();
