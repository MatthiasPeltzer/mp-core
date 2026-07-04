<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') or die('Access denied.');

/**
 * Allowed child CTypes for ce_accordion and ce_tabs (panel containers).
 *
 * Declared via a guarded define() rather than a top-level const so re-evaluating
 * this override file (e.g. when the TCA is rebuilt multiple times in the same
 * PHP process, as functional tests do) does not raise a redefinition warning.
 */
if (!defined('MP_CORE_PANEL_ALLOWED_CONTENT_TYPES')) {
    define('MP_CORE_PANEL_ALLOWED_CONTENT_TYPES', 'header,text,textpic,ce_accordion,ce_tabs,ce_container,mpc_vidply');
}

(static function (): void {
    /**
     * Shared container wrapper fields used by ce_container, ce_grid, ce_accordion, ce_tabs, ce_slider.
     */
    $sharedContainerFields = [
        'grid_container' => [
            'exclude' => false,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.container',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.container.description',
            'displayCond' => 'FIELD:grid_icon_switch:=:0',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.container',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
    ];

    $sharedContainerPalettes = [
        'grid_container_pallet' => [
            'showitem' => 'grid_bgfullsize,grid_container',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $sharedContainerPalettes;
    ExtensionManagementUtility::addTCAcolumns('tt_content', $sharedContainerFields);
})();
