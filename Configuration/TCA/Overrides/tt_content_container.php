<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use Mpc\MpCore\UserFunc\ColorPickerValueItems;
use TYPO3\CMS\Core\Resource\FileType;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

(static function (): void {
    /**
     * Register container
     */
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        new ContainerConfiguration(
            'ce_container',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:container.title',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:container.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:content',
                        'colPos' => 101,
                    ],
                ],
            ]
        )
        ->setIcon('tx_container')
        ->setSaveAndCloseInNewContentElementWizard(false)
    );

    // Container background / wrapper options (only for ce_container)
    $containerFields = [
        'grid_bgcolor' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgcolor',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgcolor.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [],
                'itemsProcFunc' => ColorPickerValueItems::class . '->getItems',
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_icon_switch' => [
            'exclude' => false,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.grid_icon_switch',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.grid_icon_switch.description',
            'onChange' => 'reload',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.grid_icon_switch',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'grid_icon' => [
            'exclude' => true,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.icon',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.icon.description',
            'displayCond' => 'FIELD:grid_icon_switch:=:1',
            'config' => [
                'type' => 'file',
                'allowed' => 'png,jpg,jpeg,gif,svg,webp',
                'maxitems' => 1,
                'appearance' => [
                    'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference',
                    'showPossibleLocalizationRecords' => true,
                ],
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
                'overrideChildTca' => [
                    'columns' => [
                        'description' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'link' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'title' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'outline' => [
                            'config' => [
                                'renderType' => 'passthrough',
                                'type' => 'passthrough',
                            ],
                        ],
                        'caption' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                    ],
                    'types' => [
                        '0' => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                        FileType::TEXT->value => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                        FileType::IMAGE->value => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                        FileType::AUDIO->value => [
                            'showitem' => '
                                --palette--;;audioOverlayPalette,
                                --palette--;;filePalette',
                        ],
                        FileType::VIDEO->value => [
                            'showitem' => '
                                --palette--;;videoOverlayPalette,
                                --palette--;;filePalette',
                        ],
                        FileType::APPLICATION->value => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                    ],
                ],
            ],
        ],
        'grid_light' => [
            'exclude' => false,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.light',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.light.description',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.light',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'grid_parallax' => [
            'exclude' => false,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.parallax',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.parallax.description',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.parallax',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'grid_bgfullsize' => [
            'exclude' => false,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgfullsize',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgfullsize.description',
            'displayCond' => 'FIELD:grid_icon_switch:=:0',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgfullsize',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => '0',
            ],
        ],
        'grid_bgimage' => [
            'exclude' => true,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bgimage.container',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bgimage.container.description',
            'config' => [
                'type' => 'file',
                'allowed' => 'png,jpg,jpeg,gif,svg,webp',
                'maxitems' => 1,
                'appearance' => [
                    'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference',
                    'showPossibleLocalizationRecords' => true,
                ],
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
                'overrideChildTca' => [
                    'columns' => [
                        'description' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'link' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'title' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                        'outline' => [
                            'config' => [
                                'renderType' => 'passthrough',
                                'type' => 'passthrough',
                            ],
                        ],
                        'caption' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];

    $containerPalettes = [
        'grid_bg' => [
            'showitem' => 'grid_bgcolor,grid_light,grid_icon_switch,--linebreak--,grid_icon,--linebreak--,grid_bgimage,--linebreak--,grid_parallax',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $containerPalettes;
    ExtensionManagementUtility::addTCAcolumns('tt_content', $containerFields);

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_container']['showitem'] = '
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
        --palette--;Header Config;header_config,subheader,
    --div--;Container,
        --palette--;;grid_bg,
        --palette--;;grid_container_pallet,
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
})();
