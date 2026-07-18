<?php

declare(strict_types=1);

use Mpc\MpCore\Middleware\LlmsTxtMiddleware;
use Mpc\MpCore\Middleware\RobotsTxtMiddleware;
use Mpc\MpCore\Middleware\SearchSuggestMiddleware;

return [
    'frontend' => [
        'mpc/mp-core/search-suggest' => [
            'target' => SearchSuggestMiddleware::class,
            // Needs the resolved frontend user (group access filtering) but must
            // run before the page is rendered so the request can be short-circuited.
            'after' => [
                'typo3/cms-frontend/authentication',
            ],
            'before' => [
                'typo3/cms-frontend/page-resolver',
            ],
        ],
        'mpc/mp-core/robots-txt' => [
            'target' => RobotsTxtMiddleware::class,
            'after' => [
                'typo3/cms-frontend/site',
            ],
            'before' => [
                'typo3/cms-frontend/static-route-resolver',
                'typo3/cms-frontend/page-resolver',
            ],
        ],
        'mpc/mp-core/llms-txt' => [
            'target' => LlmsTxtMiddleware::class,
            'after' => [
                'typo3/cms-frontend/site',
            ],
            'before' => [
                'typo3/cms-frontend/static-route-resolver',
                'typo3/cms-frontend/page-resolver',
            ],
        ],
    ],
];
