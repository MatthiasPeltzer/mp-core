<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Support;

use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

/**
 * Ensures composer require-dev sysexts are activated; TYPO3 14 PackageCollection
 * resolves them as mp_core dependencies during functional bootstrap.
 */
abstract class MpCoreFunctionalTestCase extends FunctionalTestCase
{
    /**
     * @var list<string>
     */
    protected array $coreExtensionsToLoad = MpCoreFunctionalTestBootstrap::CORE_EXTENSIONS_TO_LOAD;
}
