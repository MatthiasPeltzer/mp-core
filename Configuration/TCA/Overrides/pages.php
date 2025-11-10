<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

(static function (): void {
    $visibleoptions = [
        'newsletter' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.NewsletterBox',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.NewsletterBox.description',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.NewsletterBox',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
            ],
        ],

        'socialmedia' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.SocialmediaBar',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.SocialmediaBar.description',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.SocialmediaBar',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
            ],
        ],

        'breadcrumb' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.Breadcrumb',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.Breadcrumb.description',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.Breadcrumb',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
            ],
        ],

        'headercontainer' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.HeaderContainer',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.HeaderContainer.description',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.HeaderContainer',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
            ],
        ],

        'teaser_description' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.TeaserDescription',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:pages.TeaserDescription.description',
            'config' => [
                'type' => 'text',
                'cols' => 60,
                'rows' => 10,
            ],
        ],

        'link_icon' => [
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:linkicon.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:linkicon.description',
            'config' => [
                'type' => 'file',
                'minitems' => 0,
                'maxitems' => 1,
                'allowed' => 'svg',
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
                        'crop' => [
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
    ];
    ExtensionManagementUtility::addTCAcolumns('pages', $visibleoptions);
    ExtensionManagementUtility::addFieldsToPalette('pages', 'layout', '--linebreak--,newsletter,socialmedia,breadcrumb,headercontainer', 'after:newUntil');
    ExtensionManagementUtility::addFieldsToPalette('pages', 'media', '--linebreak--,teaser_description,link_icon', 'after:media');
})();
