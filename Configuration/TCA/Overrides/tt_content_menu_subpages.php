<?php

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') or die();

ExtensionManagementUtility::addRecordType(
    [
        'label' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:CType.menu_subpages',
        'description' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:CType.menu_subpages.description',
        'value' => 'menu_subpages',
        'icon' => 'content-menu-pages',
        'group' => 'menu',
    ],
    '
        --palette--;;headers,
        pages;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:pages.ALT.menu_formlabel,
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:appearance,
        --palette--;;frames,header_subpages,grid_bgcolor,grid_columns,grid_light,tx_link_switch,tx_link_text,tx_link_layout,
        --palette--;;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/locallang_tabs.xlf:categories,
        --div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:sys_category.tabs.category,categories'
);
