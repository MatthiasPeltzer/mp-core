<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

use Mpc\MpCore\Middleware\HtmlWhitespaceCompressorMiddleware;

return [
    'frontend' => [
        'mpc/mp-core/html-whitespace-compressor' => [
            'target' => HtmlWhitespaceCompressorMiddleware::class,
            'after' => [
                'typo3/cms-frontend/content-length-headers',
            ],
            'before' => [
                'typo3/cms-core/response-propagation',
            ],
        ],
    ],
];
