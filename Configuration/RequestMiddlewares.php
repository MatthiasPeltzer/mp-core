<?php

declare(strict_types=1);

use Mpc\MpCore\Middleware\LlmsTxtMiddleware;
use Mpc\MpCore\Middleware\RobotsTxtMiddleware;

return [
    'frontend' => [
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
