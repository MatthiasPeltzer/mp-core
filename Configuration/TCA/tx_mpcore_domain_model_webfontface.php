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
        'title' => $ll . 'tx_mpcore_domain_model_webfontface',
        'label' => 'weight',
        'label_alt' => 'font_style',
        'label_alt_force' => true,
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'delete' => 'deleted',
        'sortby' => 'sorting',
        'enablecolumns' => [
            'disabled' => 'hidden',
        ],
        'hideTable' => true,
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
        'parentid' => [
            'config' => [
                'type' => 'passthrough',
            ],
        ],
        'parenttable' => [
            'config' => [
                'type' => 'passthrough',
            ],
        ],
        'weight' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontface.weight',
            'description' => $ll . 'tx_mpcore_domain_model_webfontface.weight.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['label' => '100 (Thin)', 'value' => '100'],
                    ['label' => '200 (Extra Light)', 'value' => '200'],
                    ['label' => '300 (Light)', 'value' => '300'],
                    ['label' => '400 (Normal)', 'value' => '400'],
                    ['label' => '500 (Medium)', 'value' => '500'],
                    ['label' => '600 (Semi Bold)', 'value' => '600'],
                    ['label' => '700 (Bold)', 'value' => '700'],
                    ['label' => '800 (Extra Bold)', 'value' => '800'],
                    ['label' => '900 (Black)', 'value' => '900'],
                ],
                'default' => '400',
            ],
        ],
        'font_style' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontface.font_style',
            'description' => $ll . 'tx_mpcore_domain_model_webfontface.font_style.description',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['label' => 'normal', 'value' => 'normal'],
                    ['label' => 'italic', 'value' => 'italic'],
                ],
                'default' => 'normal',
            ],
        ],
        'file' => [
            'exclude' => false,
            'label' => $ll . 'tx_mpcore_domain_model_webfontface.file',
            'description' => $ll . 'tx_mpcore_domain_model_webfontface.file.description',
            'config' => [
                'type' => 'file',
                'allowed' => 'woff2',
                'maxitems' => 1,
                'minitems' => 1,
            ],
        ],
        'unicode_range' => [
            'exclude' => true,
            'label' => $ll . 'tx_mpcore_domain_model_webfontface.unicode_range',
            'description' => $ll . 'tx_mpcore_domain_model_webfontface.unicode_range.description',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 255,
                'eval' => 'trim',
            ],
        ],
    ],
    'types' => [
        '0' => [
            'showitem' => '
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                    weight, font_style, file, unicode_range,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                    hidden,
            ',
        ],
    ],
];
