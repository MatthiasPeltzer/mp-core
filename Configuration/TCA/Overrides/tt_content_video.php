<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['video'] = 'tx_video';

    $tempVideoColumns = [
        'tx_video_caption' =>
            [
                'config' =>
                    [
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
                'exclude' => '1',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_caption',
            ],
        'tx_video_video' =>
            [
                'config' =>
                    [
                        'type' => 'file',
                        'allowed' => 'mp4,webm,ogg,youtube,vimeo,externalvideo',
                        'maxitems' => 10,
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
                                        'placeholder' => '1080p, 720p, 4K, etc.',
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
                                \TYPO3\CMS\Core\Resource\File::FILETYPE_VIDEO => [
                                    'showitem' => 'tx_quality_label,--palette--;;filePalette',
                                ],
                                '0' => [
                                    'showitem' => 'tx_quality_label,--palette--;;filePalette',
                                ],
                            ],
                        ],
                    ],
                'exclude' => '1',
                'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_video',
            ],
        // Playback Options
        'tx_video_autoplay' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_autoplay',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_video_loop' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_loop',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_video_muted' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_muted',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_video_volume' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_volume',
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
        'tx_video_playback_speed' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_playback_speed',
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
        'tx_video_start_time' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_start_time',
            'config' => [
                'type' => 'input',
                'eval' => 'int',
                'default' => 0,
                'placeholder' => '0',
            ],
        ],
        // Control Buttons
        'tx_video_controls' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_controls',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_speed_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_speed_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_volume_control' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_volume_control',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_fullscreen_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_fullscreen_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_pip_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_pip_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_chapters_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_chapters_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_quality_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_quality_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Caption Options
        'tx_video_captions' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_captions',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_captions_default' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_captions_default',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_video_captions_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_captions_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_caption_style_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_caption_style_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Transcript Options
        'tx_video_transcript' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_transcript',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
            ],
        ],
        'tx_video_transcript_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_transcript_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Audio Description
        'tx_video_audio_description_src' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_audio_description_src',
            'config' => [
                'type' => 'file',
                'allowed' => 'mp4,webm,ogg',
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
                                'placeholder' => '720p AD, 1080p AD, etc.',
                                'eval' => 'trim',
                            ],
                        ],
                    ],
                    'types' => [
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_VIDEO => [
                            'showitem' => 'tx_quality_label,--palette--;;filePalette',
                        ],
                        '0' => [
                            'showitem' => 'tx_quality_label,--palette--;;filePalette',
                        ],
                    ],
                ],
            ],
        ],
        'tx_video_audio_description_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_audio_description_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Sign Language
        'tx_video_sign_language_src' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_sign_language_src',
            'config' => [
                'type' => 'file',
                'allowed' => 'mp4,webm,ogg',
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
                                'placeholder' => '720p SL, 1080p SL, etc.',
                                'eval' => 'trim',
                            ],
                        ],
                    ],
                    'types' => [
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_VIDEO => [
                            'showitem' => 'tx_quality_label,--palette--;;filePalette',
                        ],
                        '0' => [
                            'showitem' => 'tx_quality_label,--palette--;;filePalette',
                        ],
                    ],
                ],
            ],
        ],
        'tx_video_sign_language_button' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_sign_language_button',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_sign_language_position' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_sign_language_position',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'default' => 'bottom-right',
                'items' => [
                    ['Bottom Right', 'bottom-right'],
                    ['Bottom Left', 'bottom-left'],
                    ['Top Right', 'top-right'],
                    ['Top Left', 'top-left'],
                ],
            ],
        ],
        // Accessibility Options
        'tx_video_keyboard' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_keyboard',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        'tx_video_screen_reader' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_screen_reader',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 1,
            ],
        ],
        // Language
        'tx_video_language' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tx_video_language',
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
    ExtensionManagementUtility::addTCAcolumns('tt_content', $tempVideoColumns);

    $videoPalettes = [
        'video_config' => [
            'showitem' => 'tx_video_video,--linebreak--,imageorient,--linebreak--,image',
            'canNotCollapse' => 1,
        ],
        'video_playback' => [
            'showitem' => 'tx_video_autoplay,tx_video_loop,tx_video_muted,--linebreak--,tx_video_volume,tx_video_playback_speed,tx_video_start_time',
        ],
        'video_controls' => [
            'showitem' => 'tx_video_controls,--linebreak--,tx_video_speed_button,tx_video_volume_control,tx_video_fullscreen_button,--linebreak--,tx_video_pip_button,tx_video_chapters_button,tx_video_quality_button',
        ],
        'video_captions_settings' => [
            'showitem' => 'tx_video_caption,--linebreak--,tx_video_captions,tx_video_captions_default,--linebreak--,tx_video_captions_button,tx_video_caption_style_button',
        ],
        'video_transcript_settings' => [
            'showitem' => 'tx_video_transcript,tx_video_transcript_button',
        ],
        'video_audio_description' => [
            'showitem' => 'tx_video_audio_description_src,--linebreak--,tx_video_audio_description_button',
        ],
        'video_sign_language' => [
            'showitem' => 'tx_video_sign_language_src,--linebreak--,tx_video_sign_language_position,tx_video_sign_language_button',
        ],
        'video_accessibility' => [
            'showitem' => 'tx_video_keyboard,tx_video_screen_reader,--linebreak--,tx_video_language',
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes'] += $videoPalettes;

    $GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
        'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.CType.video',
        'video',
        'tx_video',
        'default',
    ];

    $tempVideoTypes = [
        'video' =>
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
                                                'allow_download' => [
                                                    'config' => [
                                                        'renderType' => 'passthrough',
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
                        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
                        --palette--;;header_config,subheader,bodytext,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_config;video_config,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_playback,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_playback;video_playback,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_controls,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_controls;video_controls,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_captions,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_captions_settings;video_captions_settings,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_transcript,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_transcript_settings;video_transcript_settings,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_audio_description,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_audio_description;video_audio_description,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_sign_language,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_sign_language;video_sign_language,
                    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.tabs.video_accessibility,
                        --palette--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:tt_content.palettes.video_accessibility;video_accessibility,
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

    $GLOBALS['TCA']['tt_content']['types'] += $tempVideoTypes;
})();
