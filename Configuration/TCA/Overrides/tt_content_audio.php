<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['audio'] = 'tx_audio';

    $tempAudioColumns = [
        'tx_audio_audio' =>
            [
                'config' =>
                    [
                        'type' => 'file',
                        'allowed' => 'mp3,wav,webm,ogg,externalaudio',
                        'maxitems' => 5,
                        'minitems' => 0,
                        'overrideChildTca' => [
                            'columns' => [
                                'title' => [
                                    'config' => [
                                        'type' => 'passthrough',
                                    ],
                                ],
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
                                'tx_quality_label' => [
                                    'config' => [
                                        'type' => 'input',
                                        'size' => 20,
                                        'placeholder' => 'High Quality, Standard, Low, etc.',
                                        'eval' => 'trim',
                                    ],
                                ],
                                'autoplay' => [
                                    'config' => [
                                        'renderType' => 'passthrough',
                                        'type' => 'passthrough',
                                    ],
                                ],
                            ],
                            'types' => [
                                \TYPO3\CMS\Core\Resource\File::FILETYPE_AUDIO => [
                                    'showitem' => 'tx_quality_label,--palette--;;filePalette',
                                ],
                                '0' => [
                                    'showitem' => 'tx_quality_label,--palette--;;filePalette',
                                ],
                            ],
                        ],
                    ],
                'exclude' => '1',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_audio',
            ],
        // Playback Options
        'tx_audio_autoplay' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_autoplay',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_audio_loop' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_loop',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_audio_muted' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_muted',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_audio_volume' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_volume',
            'config' => [
                'type' => 'input',
                'eval' => 'double2',
                'default' => 0.8,
                'range' => [
                    'lower' => 0,
                    'upper' => 1,
                ],
                'slider' => [
                    'step' => 0.1,
                    'width' => 200,
                ],
            ],
        ],
        'tx_audio_playback_speed' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_playback_speed',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'default' => '1.0',
                'items' => [
                    ['0.25x', '0.25'],
                    ['0.5x', '0.5'],
                    ['0.75x', '0.75'],
                    ['Normal (1.0x)', '1.0'],
                    ['1.25x', '1.25'],
                    ['1.5x', '1.5'],
                    ['1.75x', '1.75'],
                    ['2.0x', '2.0'],
                ],
            ],
        ],
        'tx_audio_start_time' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_start_time',
            'config' => [
                'type' => 'input',
                'eval' => 'int',
                'default' => 0,
                'placeholder' => '0',
            ],
        ],
        // Control Buttons
        'tx_audio_controls' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_controls',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_speed_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_speed_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_volume_control' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_volume_control',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Caption Options
        'tx_audio_captions' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_captions',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_captions_default' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_captions_default',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_audio_captions_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_captions_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_caption_style_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_caption_style_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_caption_file' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_caption_file',
            'config' => [
                'type' => 'file',
                'allowed' => 'vtt',
                'maxitems' => 20,
                'minitems' => 0,
                'overrideChildTca' => [
                    'columns' => [
                        'title' => [
                            'config' => [
                                'type' => 'input',
                                'size' => 30,
                                'placeholder' => 'Deutsch',
                                'required' => false,
                            ],
                        ],
                        'tx_lang_code' => [
                            'config' => [
                                'type' => 'input',
                                'size' => 10,
                                'max' => 10,
                                'placeholder' => 'de',
                                'eval' => 'trim',
                                'required' => false,
                            ],
                        ],
                        'tx_track_kind' => [
                            'config' => [
                                'type' => 'select',
                                'renderType' => 'selectSingle',
                                'items' => [
                                    ['Captions', 'captions'],
                                    ['Subtitles', 'subtitles'],
                                    ['Descriptions', 'descriptions'],
                                    ['Chapters', 'chapters'],
                                    ['Metadata', 'metadata'],
                                ],
                                'default' => 'captions',
                            ],
                        ],
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
                        'alternative' => [
                            'config' => [
                                'type' => 'passthrough',
                            ],
                        ],
                    ],
                    'types' => [
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_TEXT => [
                            'showitem' => '
                                --palette--;;vttFilePalette,
                                --palette--;;filePalette'
                        ],
                    ],
                ],
            ],
        ],
        // Transcript Options
        'tx_audio_transcript' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_transcript',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_audio_transcript_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_transcript_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Accessibility Options
        'tx_audio_keyboard' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_keyboard',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_audio_screen_reader' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_screen_reader',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Language
        'tx_audio_language' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_audio_language',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'default' => 'de',
                'items' => [
                    ['English', 'en'],
                    ['Deutsch', 'de'],
                    ['Español', 'es'],
                    ['Français', 'fr'],
                    ['日本語', 'ja'],
                ],
            ],
        ],
    ];
    ExtensionManagementUtility::addTCAcolumns('tt_content', $tempAudioColumns);

    $audioPalettes = [
        'audio_config' => [
            'showitem' => 'tx_audio_audio,--linebreak--,image',
            'canNotCollapse' => 1,
        ],
        'audio_playback' => [
            'showitem' => 'tx_audio_autoplay,tx_audio_loop,tx_audio_muted,--linebreak--,tx_audio_volume,tx_audio_playback_speed,tx_audio_start_time',
        ],
        'audio_controls' => [
            'showitem' => 'tx_audio_controls,--linebreak--,tx_audio_speed_button,tx_audio_volume_control',
        ],
        'audio_captions_settings' => [
            'showitem' => 'tx_audio_caption_file,--linebreak--,tx_audio_captions,tx_audio_captions_default,--linebreak--,tx_audio_captions_button,tx_audio_caption_style_button',
        ],
        'audio_transcript_settings' => [
            'showitem' => 'tx_audio_transcript,tx_audio_transcript_button',
        ],
        'audio_accessibility' => [
            'showitem' => 'tx_audio_keyboard,tx_audio_screen_reader,--linebreak--,tx_audio_language',
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $audioPalettes;

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.audio',
        'audio',
        'tx_audio',
        'default',
    ];

    $tempAudioTypes = [
        'audio' =>
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
                                        'allowed' => 'jpg,jpeg,svg,png,gif',
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
                                                'allow_download' => [
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
                    ],
                'showitem' => '
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header,
                        --palette--;;header_config,subheader,bodytext,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_config;audio_config,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio_playback,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_playback;audio_playback,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio_controls,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_controls;audio_controls,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio_captions,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_captions_settings;audio_captions_settings,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio_transcript,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_transcript_settings;audio_transcript_settings,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.audio_accessibility,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.audio_accessibility;audio_accessibility,
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
                    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended',
            ],
    ];

    $GLOBALS['TCA']['tt_content']['types'] += $tempAudioTypes;
})();
