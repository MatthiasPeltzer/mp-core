<?php

declare(strict_types=1);

defined('TYPO3') || die();

(static function (): void {
    $GLOBALS['SiteConfiguration']['site']['columns']['search'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.search.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.search.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['subnav'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.subnav.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.subnav.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['subnavOrder'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.subnavOrder.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.subnavOrder.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['navType'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.navType',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.navType.description',
        'config' => [
            'items' =>
                [
                    0 =>
                        [
                            0 => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.navType.0',
                            1 => '1',
                        ],
                    1 =>
                        [
                            0 => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.navType.1',
                            1 => '2',
                        ],
                    2 =>
                        [
                            0 => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.navType.2',
                            1 => '3',
                        ],
                ],
            'renderType' => 'selectSingle',
            'type' => 'select',
        ],
    ];

    // Add copyrightText to the page
    $GLOBALS['SiteConfiguration']['site']['columns']['copyrightText'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.copyrightText.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.copyrightText.description',
        'config' => [
            'type' => 'text',
            'renderType' => 'input',
        ],
    ];

    // Add different favicons to the page
    $GLOBALS['SiteConfiguration']['site']['columns']['apple-touch-icon'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.apple-touch-icon',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.apple-touch-icon',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['faviconIco'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.faviconIco',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.faviconIco',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['faviconSvg'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.faviconSvg',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.faviconSvg',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['favicon-96x96-png'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.favicon-96x96-png',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.favicon-96x96-png',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['webmanifest'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.webmanifest',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.webmanifest',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['web-app-manifest-192x192'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.web-app-manifest-192x192',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.web-app-manifest-192x192',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['web-app-manifest-512x512'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.web-app-manifest-512x512',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.description.web-app-manifest-512x512',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-toggle'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-toggle',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-toggle.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-1"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-1.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-1.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-1"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-1",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-1.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-2"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-2.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-2.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-2"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-2",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-2.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-3"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-3.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-3.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-3"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-3",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-3.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-4"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-4.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-4.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-4"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-4",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-4.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-5"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-5.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-5.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-5"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-5",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-5.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-6"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-6.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-6.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-6"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-6",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-6.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-7"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-7.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-7.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-7"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-7",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-7.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["label-color-8"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-8.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-8.label.description",
        'config' => [
            'type' => 'input',
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["color-8"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-8",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-8.description",
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-primary'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-primary.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-primary.description',
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-secondary'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-secondary.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-secondary.description',
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-secondary-rgba'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-secondary-rgba.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-secondary-rgba.description',
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-tertiary'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-tertiary.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-tertiary.description',
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['color-quaternary'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-quaternary.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-quaternary.description',
        'config' => [
            'type' => 'input',
            'renderType' => 'color',
            'opacity' => true,
            'size' => 25,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['styles'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.styles',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.styles.description',
        'config' => [
            'type' => 'text',
            'placeholder' => ':root {' . LF . '  --bs-primary: #000' . LF . '}',
            'rows' => 5,
            'cols' => 30,
            'max' => 5000,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['socialMediaSwitch'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.socialMediaSwitch.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.socialMediaSwitch.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['facebook'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.facebook.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['x'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.x.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['instagram'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.instagram.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['threads'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.threads.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['mastodon'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.mastodon.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['bluesky'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.bluesky.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['tiktok'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.tiktok.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['tumblr'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.tumblr.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['reddit'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.reddit.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['linkedin'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.linkedin.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['xing'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.xing.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['youtube'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.youtube.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['vimeo'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.vimeo.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['spotify'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.spotify.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['bandcamp'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.bandcamp.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['soundcloud'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.soundcloud.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['pinterest'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.pinterest.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['whatsapp'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.whatsapp.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['signal'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.signal.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['telegram'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.telegram.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['discord'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.discord.label',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoBig'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoBig.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoBig.description',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoSmall'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoSmall.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoSmall.description',
        'config' =>
            [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoSvg'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoSvg.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoSvg.description',
        'config' =>
            [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 1,
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']["logoText"] = [
        'label' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoText.label",
        'description' => "LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoText.description",
        'config' => [
            'type' => 'input',
            'size' => 50,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoTextHidden'] = [
        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoTextHidden.label',
        'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logoTextHidden.description',
        'config' =>
            [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
    ];

    $GLOBALS['SiteConfiguration']['site']['types']['0']['showitem'] .= '
        ,--div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.customization, navType, subnav, subnavOrder, search, copyrightText
        ,--div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.favicons, favicon-96x96-png, faviconIco, faviconSvg, apple-touch-icon, webmanifest, web-app-manifest-192x192, web-app-manifest-512x512
        ,--div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.colorsAndStyles, color-toggle, label-color-1, color-1, label-color-2, color-2, label-color-3, color-3, label-color-4, color-4, label-color-5, color-5, label-color-6, color-6, label-color-7, color-7, label-color-8, color-8, color-primary, color-secondary, color-secondary-rgba, color-tertiary, color-quaternary, styles
        ,--div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.socialMediaTitle.title, socialMediaSwitch, facebook, x, instagram, threads, mastodon, bluesky, tiktok, tumblr, reddit, linkedin, xing, youtube, vimeo, spotify, bandcamp, soundcloud, pinterest, whatsapp, signal, telegram, discord
        ,--div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.logos.title, logoBig, logoSmall, logoSvg, logoText, logoTextHidden
    ';
})();

$localizableKeys = [
    'copyrightText',
];

$localizableKeysLogo = [
    'logoBig',
    'logoSmall',
    'logoSvg',
];

$localizableKeysText = [
    'logoText',
    'logoTextHidden',
];

foreach ($localizableKeys as $localizableKey) {
    $GLOBALS['SiteConfiguration']['site_language']['columns'][$localizableKey] = $GLOBALS['SiteConfiguration']['site']['columns'][$localizableKey];
}

foreach ($localizableKeysLogo as $localizableKeyLogo) {
    $GLOBALS['SiteConfiguration']['site_language']['columns'][$localizableKeyLogo] = $GLOBALS['SiteConfiguration']['site']['columns'][$localizableKeyLogo];
}

foreach ($localizableKeysText as $localizableKeyText) {
    $GLOBALS['SiteConfiguration']['site_language']['columns'][$localizableKeyText] = $GLOBALS['SiteConfiguration']['site']['columns'][$localizableKeyText];
}

$GLOBALS['SiteConfiguration']['site_language']['palettes']['localized-variables'] = [
    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.label',
    'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.description',
    'showitem' => implode(',', $localizableKeys),
];

$GLOBALS['SiteConfiguration']['site_language']['palettes']['localized-variables-logo'] = [
    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.label',
    'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.description',
    'showitem' => implode(',', $localizableKeysLogo),
];

$GLOBALS['SiteConfiguration']['site_language']['palettes']['localized-variables-text'] = [
    'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.label',
    'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.description',
    'showitem' => implode(',', $localizableKeysText),
];

$GLOBALS['SiteConfiguration']['site_language']['types']['1']['showitem'] .= ',--palette--;;localized-variables';
$GLOBALS['SiteConfiguration']['site_language']['types']['1']['showitem'] .= ',--palette--;;localized-variables-logo';
$GLOBALS['SiteConfiguration']['site_language']['types']['1']['showitem'] .= ',--palette--;;localized-variables-text';
