<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

return [
    'dependencies' => ['backend'],
    'tags' => [
        'backend.form',
    ],
    'imports' => [
        // CKEditor 5 Definition List Plugin
        '@mpc/mp-core/ckeditor/definition-list.js' => 'EXT:mp_core/Resources/Public/JavaScripts/ckeditor/definition-list.js',
    ],
];
