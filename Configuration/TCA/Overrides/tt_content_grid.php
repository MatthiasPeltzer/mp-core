<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
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

    $gutterItems = [
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.gutter.default',
            'value' => '',
        ],
        ['label' => '0', 'value' => '0'],
        ['label' => '1', 'value' => '1'],
        ['label' => '2', 'value' => '2'],
        ['label' => '3', 'value' => '3'],
        ['label' => '4', 'value' => '4'],
        ['label' => '5', 'value' => '5'],
    ];

    $breakpointItems = [
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint.xl',
            'value' => 'xl',
        ],
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint.md',
            'value' => 'md',
        ],
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint.lg',
            'value' => 'lg',
        ],
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint.xxl',
            'value' => 'xxl',
        ],
    ];

    $colWidthItems = [
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.colwidth.auto',
            'value' => '',
        ],
    ];
    for ($i = 1; $i <= 12; $i++) {
        $colWidthItems[] = [
            'label' => 'col-' . $i . ' (' . $i . '/12)',
            'value' => (string)$i,
        ];
    }

    $offsetItems = [
        [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset.none',
            'value' => '',
        ],
    ];
    for ($i = 1; $i <= 11; $i++) {
        $offsetItems[] = [
            'label' => 'offset-' . $i,
            'value' => (string)$i,
        ];
    }

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
                    'behaviour' => [
                        'allowLanguageSynchronization' => true,
                    ],
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
                    'onChange' => 'reload',
                    'behaviour' => [
                        'allowLanguageSynchronization' => true,
                    ],
                ],
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.columns.description',
        ],
        'grid_breakpoint' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.breakpoint.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $breakpointItems,
                'default' => 'xl',
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_gutter' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.gutter',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.gutter.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $gutterItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_col1' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col1',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $colWidthItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_offset1' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset1',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $offsetItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_col2' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col2',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col.description',
            'displayCond' => 'FIELD:grid_columns:>=:2',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $colWidthItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_offset2' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset2',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset.description',
            'displayCond' => 'FIELD:grid_columns:>=:2',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $offsetItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_col3' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col3',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col.description',
            'displayCond' => 'FIELD:grid_columns:>=:3',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $colWidthItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_offset3' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset3',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset.description',
            'displayCond' => 'FIELD:grid_columns:>=:3',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $offsetItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_col4' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col4',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.col.description',
            'displayCond' => 'FIELD:grid_columns:>=:4',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $colWidthItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
        'grid_offset4' => [
            'exclude' => '1',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset4',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.offset.description',
            'displayCond' => 'FIELD:grid_columns:>=:4',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => $offsetItems,
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ],
    ];

    $gridPalettes = [
        'grid_config' => [
            'showitem' => 'grid_type,grid_columns,grid_breakpoint,--linebreak--,grid_col1,grid_offset1,--linebreak--,grid_col2,grid_offset2,--linebreak--,grid_col3,grid_offset3,--linebreak--,grid_col4,grid_offset4,--linebreak--,grid_gutter',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $gridPalettes;

    // override default settings
    $GLOBALS['TCA']['tt_content']['types']['ce_grid']['showitem'] = '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
            --palette--;;header_config,subheader,
        --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:grid.title,
            --palette--;;grid_config,
            --palette--;;grid_container_pallet,
        --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames_ce_grid,
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

    // For ce_grid we only need spacing controls (no "layout" select, no other frame options).
    // Define an explicit palette to avoid fragile string manipulation.
    $GLOBALS['TCA']['tt_content']['palettes']['frames_ce_grid'] = [
        'showitem' => 'space_before_class,space_after_class',
    ];

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
