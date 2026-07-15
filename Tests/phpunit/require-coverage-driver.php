<?php

declare(strict_types=1);

/**
 * Fail fast with a helpful message when PHPUnit coverage flags are used without
 * a loaded coverage driver (Xdebug or PCOV).
 */
if (extension_loaded('pcov') || extension_loaded('xdebug')) {
    return;
}

fwrite(
    STDERR,
    "No code coverage driver available (Xdebug or PCOV required).\n"
    . "In DDEV: ddev xdebug on\n"
    . "Then rerun: composer test:coverage\n",
);

exit(1);
