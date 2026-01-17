<?php

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
