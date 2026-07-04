<?php

declare(strict_types=1);

/**
 * Bootstrap for the mp_core unit test suite.
 *
 * The extension can be tested either standalone (its own `composer install`,
 * which uses the `.Build/vendor` vendor-dir configured in composer.json) or from
 * inside the mpcore monorepo where it is symlinked into the project's vendor
 * directory via a Composer path repository. We probe the standalone `.Build`
 * layout first and fall back to the other common locations.
 */

$autoloadCandidates = [
    // Standalone: `composer install` inside the extension (vendor-dir=.Build/vendor).
    __DIR__ . '/../.Build/vendor/autoload.php',
    // Standalone: plain `vendor/` layout.
    __DIR__ . '/../vendor/autoload.php',
    // mpcore monorepo: extension lives at <root>/libs/mp-core.
    __DIR__ . '/../../../vendor/autoload.php',
];

foreach ($autoloadCandidates as $autoload) {
    if (is_file($autoload)) {
        require $autoload;

        return;
    }
}

fwrite(
    STDERR,
    "Unable to locate a Composer autoload.php for the mp_core test suite.\n"
    . "Run `composer install` in the extension, or run the suite from the mpcore monorepo.\n"
);
exit(1);
