<?php

$EM_CONF['mp_core'] = [
    'title' => 'MPC Distribution Package',
    'description' => 'Core TYPO3 CMS extension providing base templates, styling, container, content blocks and backend configurations',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-14.3.99',
            'rte_ckeditor' => '13.4.0-14.3.99',
            'seo' => '13.4.0-14.3.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
    'autoload' => [
        'psr-4' => [
            'Mpc\\MpCore\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'author' => 'Matthias Peltzer',
    'author_email' => 'mail@mpeltzer.de',
    'author_company' => 'private',
    'version' => '1.0.67',
];
