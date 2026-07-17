<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

$ll = 'LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:';

return [
    'ctrl' => [
        'title' => $ll . 'tx_mpcore_domain_model_webfontfamily',
        'label' => 'name',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'delete' => 'deleted',
        'default_sortby' => 'name ASC',
        'enablecolumns' => [
            'disabled' => 'hidden',
        ],
        'typeicon_classes' => [
            'default' => 'content-text',
        ],
    ],
    'columns' => [
        'hidden' => [
            'exclude' => true,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.visible',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'default' => 0,
                'items' => [
                    ['label' => '', 'invertStateDisplay' => true],
                ],
            ],
        ],
        'name' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.name',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.name.description',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 255,
                'eval' => 'trim',
                'required' => true,
            ],
        ],
        'fallback' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.fallback',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.fallback.description',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 255,
                'eval' => 'trim',
                'default' => 'sans-serif',
            ],
        ],
        'role' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.role',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.role.description',
            'onChange' => 'reload',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['label' => $ll . 'tx_mpcore_domain_model_webfontfamily.role.body', 'value' => 'body'],
                    ['label' => $ll . 'tx_mpcore_domain_model_webfontfamily.role.heading', 'value' => 'heading'],
                    ['label' => $ll . 'tx_mpcore_domain_model_webfontfamily.role.custom', 'value' => 'custom'],
                ],
                'default' => 'body',
            ],
        ],
        'css_variable' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.css_variable',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.css_variable.description',
            'displayCond' => 'FIELD:role:=:custom',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 64,
                'eval' => 'trim',
                'searchable' => false,
                'placeholder' => '--mpc-font-display',
            ],
        ],
        'font_display' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.font_display',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.font_display.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['label' => 'swap', 'value' => 'swap'],
                    ['label' => 'auto', 'value' => 'auto'],
                    ['label' => 'block', 'value' => 'block'],
                    ['label' => 'fallback', 'value' => 'fallback'],
                    ['label' => 'optional', 'value' => 'optional'],
                ],
                'default' => 'swap',
            ],
        ],
        'faces' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontfamily.faces',
            'description' => $ll . 'tx_mpcore_domain_model_webfontfamily.faces.description',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_mpcore_domain_model_webfontface',
                'foreign_field' => 'parentid',
                'foreign_table_field' => 'parenttable',
                'foreign_sortby' => 'sorting',
                'maxitems' => 99,
                'appearance' => [
                    'collapseAll' => true,
                    'expandSingle' => true,
                    'useSortable' => true,
                    'levelLinksPosition' => 'top',
                    'enabledControls' => [
                        'info' => false,
                    ],
                ],
            ],
        ],
    ],
    'types' => [
        '0' => [
            'showitem' => '
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                    name, fallback, role, css_variable, font_display, faces,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                    --palette--;;hidden,
            ',
        ],
    ],
    'palettes' => [
        'hidden' => [
            'showitem' => 'hidden',
        ],
    ],
];
