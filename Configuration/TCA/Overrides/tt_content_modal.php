<?php

declare(strict_types=1);

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

(static function (): void {
    GeneralUtility::makeInstance(Registry::class)->configureContainer(
        (new ContainerConfiguration(
            'ce_modal',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.title',
            'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.content',
                        'colPos' => 101,
                        'allowedContentTypes' => MP_CORE_PANEL_ALLOWED_CONTENT_TYPES . ',image',
                    ],
                ],
            ]
        ))
            ->setIcon('tx_modal')
            ->setSaveAndCloseInNewContentElementWizard(true)
    );

    $GLOBALS['TCA']['tt_content']['types']['ce_modal']['showitem'] = '
    --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
        --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,header_kicker,header,
        --palette--;;header_config,subheader,
    --div--;LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.title,
        container_modal_trigger,container_modal_size,container_modal_hide_trigger,image,
        --palette--;;link_config,
        grid_container,
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

    $modalFields = [
        'container_modal_trigger' => [
            'exclude' => false,
            'onChange' => 'reload',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.trigger.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.trigger.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.trigger.image',
                        'value' => 'image',
                    ],
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.trigger.link',
                        'value' => 'link',
                    ],
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.trigger.image_link',
                        'value' => 'image_link',
                    ],
                ],
                'default' => 'image_link',
            ],
        ],
        'container_modal_size' => [
            'exclude' => false,
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.size.label',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.size.md',
                        'value' => 'md',
                    ],
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.size.lg',
                        'value' => 'lg',
                    ],
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.size.xl',
                        'value' => 'xl',
                    ],
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.size.fullscreen',
                        'value' => 'fullscreen',
                    ],
                ],
                'default' => 'lg',
            ],
        ],
        'container_modal_hide_trigger' => [
            'exclude' => false,
            'onChange' => 'reload',
            'l10n_mode' => 'exclude',
            'l10n_display' => 'defaultAsReadonly',
            'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.hide_trigger.label',
            'description' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.hide_trigger.description',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        'label' => 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:modal.hide_trigger.label',
                        'labelChecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.enabled',
                        'labelUnchecked' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.disabled',
                    ],
                ],
                'default' => 0,
            ],
        ],
    ];

    ExtensionManagementUtility::addTCAcolumns('tt_content', $modalFields);

    $GLOBALS['TCA']['tt_content']['types']['ce_modal']['columnsOverrides'] = [
        'image' => [
            'config' => [
                'maxitems' => 1,
            ],
        ],
        'tx_link' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
        'tx_link_switch' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
        'tx_link_text' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
        'tx_link_layout' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
        'tx_link_position' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
        'container_modal_trigger' => [
            'displayCond' => 'FIELD:container_modal_hide_trigger:!=:1',
        ],
    ];
})();
