<?php

/**
 * This extension requires Composer and cannot be installed via TER/Extension Manager.
 *
 * Installation:
 * composer require mpc/mp-core
 *
 * Dependencies (b13/container, friendsoftypo3/content-blocks) are only available
 * through Composer/Packagist and are defined in composer.json.
 */

$_EXTKEY = "mp_core";

$EM_CONF[$_EXTKEY] = [
    'title' => 'MPC Distribution Package',
    'description' => 'Basic TYPO3 Templateset (Composer-only)',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-14.4.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Matthias Peltzer',
    'author_email' => 'mail@mpeltzer.de',
    'author_company' => 'private',
    'version' => '1.0.5',
];
