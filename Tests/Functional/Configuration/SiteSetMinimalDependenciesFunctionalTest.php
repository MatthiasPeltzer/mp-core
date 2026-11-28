<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\Configuration;

use Mpc\MpCore\Tests\Support\MpCoreTcaManifest;
use PHPUnit\Framework\Attributes\IgnoreDeprecations;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Site\Set\SetRegistry;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Mpc\MpCore\Tests\Support\MpCoreFunctionalTestCase;

#[IgnoreDeprecations]
final class SiteSetMinimalDependenciesFunctionalTest extends MpCoreFunctionalTestCase
{
    protected array $testExtensionsToLoad = MpCoreTcaManifest::FUNCTIONAL_TEST_EXTENSIONS;

    #[Test]
    public function mpcSiteSetsStayValidWithoutFormRedirectsAndIndexedSearch(): void
    {
        $registry = GeneralUtility::makeInstance(SetRegistry::class);

        $mpcInvalid = array_filter(
            $registry->getInvalidSets(),
            static fn (array $entry): bool => str_starts_with($entry['name'], 'mpc/'),
        );
        self::assertSame([], $mpcInvalid, 'Invalid mpc/* site sets: ' . json_encode($mpcInvalid, JSON_THROW_ON_ERROR));
        self::assertNotNull($registry->getSet('mpc/mp-core-base'));
    }
}
