<?php

declare(strict_types=1);

defined('TYPO3') || die();

(static function (): void {
    $lll = 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.';

    // --- Checkbox toggles ---

    foreach (['search', 'subnav', 'subnavOrder'] as $field) {
        $GLOBALS['SiteConfiguration']['site']['columns'][$field] = [
            'label' => $lll . $field . '.label',
            'description' => $lll . $field . '.description',
            'config' => [
                'renderType' => 'checkboxToggle',
                'type' => 'check',
                'default' => 0,
            ],
        ];
    }

    // --- Navigation type ---

    $GLOBALS['SiteConfiguration']['site']['columns']['navType'] = [
        'label' => $lll . 'navType',
        'description' => $lll . 'navType.description',
        'config' => [
            'items' => [
                ['label' => $lll . 'navType.0', 'value' => '1'],
                ['label' => $lll . 'navType.1', 'value' => '2'],
                ['label' => $lll . 'navType.2', 'value' => '3'],
            ],
            'renderType' => 'selectSingle',
            'type' => 'select',
        ],
    ];

    // --- Copyright text ---

    $GLOBALS['SiteConfiguration']['site']['columns']['copyrightText'] = [
        'label' => $lll . 'copyrightText.label',
        'description' => $lll . 'copyrightText.description',
        'config' => [
            'type' => 'text',
            'renderType' => 'input',
        ],
    ];

    // --- Favicons (file links) ---

    $faviconFields = [
        'apple-touch-icon',
        'faviconIco',
        'faviconSvg',
        'favicon-96x96-png',
        'webmanifest',
        'web-app-manifest-192x192',
        'web-app-manifest-512x512',
    ];
    foreach ($faviconFields as $field) {
        $GLOBALS['SiteConfiguration']['site']['columns'][$field] = [
            'label' => $lll . $field,
            'description' => $lll . 'description.' . $field,
            'config' => [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
        ];
    }

    // --- Color toggle ---

    $GLOBALS['SiteConfiguration']['site']['columns']['color-toggle'] = [
        'label' => $lll . 'color-toggle',
        'description' => $lll . 'color-toggle.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    // --- Numbered color pairs (label + color picker) ---

    for ($i = 1; $i <= 8; $i++) {
        $GLOBALS['SiteConfiguration']['site']['columns']['label-color-' . $i] = [
            'label' => $lll . 'color-' . $i . '.label',
            'description' => $lll . 'color-' . $i . '.label.description',
            'config' => [
                'type' => 'input',
                'size' => 25,
            ],
        ];
        $GLOBALS['SiteConfiguration']['site']['columns']['color-' . $i] = [
            'label' => $lll . 'color-' . $i,
            'description' => $lll . 'color-' . $i . '.description',
            'config' => [
                'type' => 'input',
                'renderType' => 'color',
                'opacity' => true,
                'size' => 25,
            ],
        ];
    }

    // --- Named color pickers ---

    $namedColors = ['color-primary', 'color-secondary', 'color-secondary-rgba', 'color-tertiary', 'color-quaternary'];
    foreach ($namedColors as $field) {
        $GLOBALS['SiteConfiguration']['site']['columns'][$field] = [
            'label' => $lll . $field . '.label',
            'description' => $lll . $field . '.description',
            'config' => [
                'type' => 'input',
                'renderType' => 'color',
                'opacity' => true,
                'size' => 25,
            ],
        ];
    }

    // --- Custom styles textarea ---

    $GLOBALS['SiteConfiguration']['site']['columns']['styles'] = [
        'label' => $lll . 'styles',
        'description' => $lll . 'styles.description',
        'config' => [
            'type' => 'text',
            'placeholder' => ':root {' . LF . '  --bs-primary: #000' . LF . '}',
            'rows' => 5,
            'cols' => 30,
            'max' => 5000,
        ],
    ];

    // --- Social media ---

    $GLOBALS['SiteConfiguration']['site']['columns']['socialMediaSwitch'] = [
        'label' => $lll . 'socialMediaSwitch.label',
        'description' => $lll . 'socialMediaSwitch.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $socialMediaPlatforms = [
        'facebook', 'x', 'instagram', 'threads', 'mastodon', 'bluesky',
        'tiktok', 'tumblr', 'reddit', 'linkedin', 'xing', 'youtube',
        'vimeo', 'spotify', 'bandcamp', 'soundcloud', 'pinterest',
        'whatsapp', 'signal', 'telegram', 'discord',
        'github', 'gitlab', 'opencode', 'packagist', 'npmjs',
    ];
    foreach ($socialMediaPlatforms as $platform) {
        $GLOBALS['SiteConfiguration']['site']['columns'][$platform] = [
            'label' => $lll . $platform . '.label',
            'config' => [
                'type' => 'link',
                'allowedTypes' => ['url'],
            ],
        ];
    }

    // --- Logos ---

    foreach (['logoBig', 'logoSmall'] as $field) {
        $GLOBALS['SiteConfiguration']['site']['columns'][$field] = [
            'label' => $lll . $field . '.label',
            'description' => $lll . $field . '.description',
            'config' => [
                'type' => 'link',
                'allowedTypes' => ['file'],
            ],
        ];
    }

    $GLOBALS['SiteConfiguration']['site']['columns']['logoSvg'] = [
        'label' => $lll . 'logoSvg.label',
        'description' => $lll . 'logoSvg.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 1,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoText'] = [
        'label' => $lll . 'logoText.label',
        'description' => $lll . 'logoText.description',
        'config' => [
            'type' => 'input',
            'size' => 50,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['logoTextHidden'] = [
        'label' => $lll . 'logoTextHidden.label',
        'description' => $lll . 'logoTextHidden.description',
        'config' => [
            'renderType' => 'checkboxToggle',
            'type' => 'check',
            'default' => 0,
        ],
    ];

    $GLOBALS['SiteConfiguration']['site']['columns']['extraEntityImage'] = [
        'label' => $lll . 'extraEntityImage.label',
        'description' => $lll . 'extraEntityImage.description',
        'config' => [
            'type' => 'link',
            'allowedTypes' => ['file'],
        ],
    ];

    // --- Show items ---

    $GLOBALS['SiteConfiguration']['site']['types']['0']['showitem'] .= '
        ,--div--;' . $lll . 'customization, navType, subnav, subnavOrder, search, copyrightText
        ,--div--;' . $lll . 'favicons, favicon-96x96-png, faviconIco, faviconSvg, apple-touch-icon, webmanifest, web-app-manifest-192x192, web-app-manifest-512x512
        ,--div--;' . $lll . 'colorsAndStyles, color-toggle, label-color-1, color-1, label-color-2, color-2, label-color-3, color-3, label-color-4, color-4, label-color-5, color-5, label-color-6, color-6, label-color-7, color-7, label-color-8, color-8, color-primary, color-secondary, color-secondary-rgba, color-tertiary, color-quaternary, styles
        ,--div--;' . $lll . 'socialMediaTitle.title, socialMediaSwitch, ' . implode(', ', $socialMediaPlatforms) . '
        ,--div--;' . $lll . 'logos.title, logoBig, logoSmall, logoSvg, logoText, logoTextHidden
        ,--div--;' . $lll . 'structuredData.title, extraEntityImage
    ';
})();

// --- Language-specific overrides ---

$localizableKeys = ['copyrightText'];
$localizableKeysLogo = ['logoBig', 'logoSmall', 'logoSvg'];
$localizableKeysText = ['logoText', 'logoTextHidden'];

foreach ([...$localizableKeys, ...$localizableKeysLogo, ...$localizableKeysText] as $key) {
    $GLOBALS['SiteConfiguration']['site_language']['columns'][$key] = $GLOBALS['SiteConfiguration']['site']['columns'][$key];
}

$lllPalette = 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:page.configuration.palette.localized-variables.';

foreach (['localized-variables' => $localizableKeys, 'localized-variables-logo' => $localizableKeysLogo, 'localized-variables-text' => $localizableKeysText] as $paletteName => $fields) {
    $GLOBALS['SiteConfiguration']['site_language']['palettes'][$paletteName] = [
        'label' => $lllPalette . 'label',
        'description' => $lllPalette . 'description',
        'showitem' => implode(',', $fields),
    ];
    $GLOBALS['SiteConfiguration']['site_language']['types']['1']['showitem'] .= ',--palette--;;' . $paletteName;
}
