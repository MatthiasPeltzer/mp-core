<?php

declare(strict_types=1);

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['singleteaser'] = 'tx_singleteaser';

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:singleteaser.title',
        'value' => 'singleteaser',
        'icon' => 'tx_singleteaser',
        'group' => 'default',
    ];

    $imagePalettes = [
        'image_config' => [
            'showitem' => 'image,--linebreak--,imageorient,imagewidth,--linebreak--,bodytext',
            'canNotCollapse' => 1,
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $imagePalettes;

    $singleteaserTypes = [

        'singleteaser' =>
            [
                'columnsOverrides' =>
                    [
                        'bodytext' =>
                            [
                                'config' =>
                                    [
                                        'richtextConfiguration' => 'default',
                                        'enableRichtext' => 1,
                                    ],
                            ],
                        'image' =>
                            [
                                'config' =>
                                    [
                                        'maxitems' => 1,
                                        'allowed' => 'png,jpg,jpeg,gif,svg,webp',
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
                                                'caption' => [
                                                    'config' => [
                                                        'type' => 'passthrough',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                            ],
                    ],
                'showitem' => '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,
            date;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:date_formlabel,
            header_kicker,
            header,
            --palette--;;header_config,
            subheader,
        --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:singleteaser.title,
            --palette--;;image_config,
            grid_bgcolor,
            --palette--;;link_config,
        --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames,
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.appearanceLinks;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                        --palette--;;hidden,
                        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
                        categories,
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
                        rowDescription,
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended',
            ],
    ];

    $GLOBALS['TCA']['tt_content']['types'] += $singleteaserTypes;
})();
