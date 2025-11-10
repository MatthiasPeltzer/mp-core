<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use Mpc\MpCore\UserFunc\ColorPickerValueItems;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

(static function (): void {
    /**
     * Register grids
     */
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        new ContainerConfiguration(
            'ce_grid',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.title',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.elements',
                        'colPos' => 101,
                    ],
                ],
            ]
        )
        ->setIcon('tx_grid')
        ->setSaveAndCloseInNewContentElementWizard(true)
    );

    $grid = [
        'grid_type' => [
            'config' =>
                [
                    'items' =>
                        [
                            0 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.type.list',
                                    'value' => 'ul',
                                ],
                            1 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.type.container',
                                    'value' => 'div',
                                ],
                        ],
                    'renderType' => 'selectSingle',
                    'type' => 'select',
                ],
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.type',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.type.description',
        ],
        'grid_columns' => [
            'config' =>
                [
                    'items' =>
                        [
                            0 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.onecol',
                                    'value' => '1',
                                ],
                            1 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.twocol',
                                    'value' => '2',
                                ],
                            2 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.threecol',
                                    'value' => '3',
                                ],
                            3 =>
                                [
                                    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.fourcol',
                                    'value' => '4',
                                ],
                        ],
                    'renderType' => 'selectSingle',
                    'type' => 'select',
                ],
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.description',
        ],
        'grid_bgcolor' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgcolor',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgcolor.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [],
                'itemsProcFunc' => ColorPickerValueItems::class . '->getItems',
            ],
        ],
        'grid_icon' => [
            'exclude' => '1',
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
                // custom configuration for displaying fields in the overlay/reference table
                // to use the imageoverlayPalette instead of the basicoverlayPalette
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
                        File::FILETYPE_TEXT => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                        File::FILETYPE_IMAGE => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                        File::FILETYPE_AUDIO => [
                            'showitem' => '
                                --palette--;;audioOverlayPalette,
                                --palette--;;filePalette',
                        ],
                        File::FILETYPE_VIDEO => [
                            'showitem' => '
                                --palette--;;videoOverlayPalette,
                                --palette--;;filePalette',
                        ],
                        File::FILETYPE_APPLICATION => [
                            'showitem' => '
                                --palette--;;imageoverlayPalette,
                                --palette--;;filePalette',
                        ],
                    ],
                ],
            ],
        ],
        'grid_icon_switch' => [
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.grid_icon_switch',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.grid_icon_switch.description',
            'onChange' => 'reload',
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
        'grid_light' => [
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.light',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.light.description',
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
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.parallax',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.parallax.description',
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
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgfullsize',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.bgfullsize.description',
            'displayCond' => 'FIELD:grid_icon_switch:=:0',
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
        'grid_container' => [
            'exclude' => '0',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.container',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bg.container.description',
            'displayCond' => 'FIELD:grid_icon_switch:=:0',
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
        'grid_bgimage' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bgimage.container',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.bgimage.container.description',
            'config' =>
                [
                    'type' => 'file',
                    'allowed' => 'png,jpg,jpeg,gif,svg,webp',
                    'maxitems' => '1',
                    'appearance' => [
                        'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference',
                        'showPossibleLocalizationRecords' => true,
                    ],
                    // custom configuration for displaying fields in the overlay/reference table
                    // to use the imageoverlayPalette instead of the basicoverlayPalette
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

    $gridPalettes = [
        'grid_config' => [
            'showitem' => 'grid_type,grid_columns', 'canNotCollapse' => 1,
        ],
        'grid_bg' => [
            'showitem' => 'grid_bgcolor,grid_light,grid_icon_switch,--linebreak--,grid_icon,--linebreak--,grid_bgimage,--linebreak--,grid_parallax', 'canNotCollapse' => 1,
        ],
        'grid_container_pallet' => [
            'showitem' => 'grid_bgfullsize,grid_container', 'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $gridPalettes;

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_grid']['showitem'] = '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
            --palette--;;header_config,subheader,
        --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.title,
            --palette--;;grid_config,grid_container,
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

    ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $grid
    );

    ExtensionManagementUtility::addFieldsToPalette(
        'tt_content',
        'container',
        'grid'
    );
})();
