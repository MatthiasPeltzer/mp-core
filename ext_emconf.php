<?php

$_EXTKEY = "mp_core";

$EM_CONF[$_EXTKEY] = [
    'title' => 'MPC Distribution Package',
    'description' => 'Basic TYPO3 Templateset',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0 - 14.4.99',
            'b13/container' => '3.1',
            'friendsoftypo3/content-blocks' => '1.3',
        ],
        'conflicts' => [],
        'suggests' => [
            'georgringer/news' => '13.0',
            'georgringer/numbered-pagination' => '2.1',
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'Mpc\\MpCore\\' => 'Classes'
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Matthias Peltzer',
    'author_email' => 'mail@mpeltzer.de',
    'author_company' => 'private',
    'version' => '1.0.2',
];
