<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\Bootstrap6ContentMigrationService;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class Bootstrap6ContentMigrationServiceTest extends TestCase
{
    #[Test]
    public function migrateHtmlFragmentReplacesButtonAndUtilityClasses(): void
    {
        $input = '<a class="btn btn-primary" href="#">Go</a><div class="col-md-6 text-muted"></div>';
        $expected = '<a class="btn btn-solid theme-primary" href="#">Go</a><div class="md:col-6 fg-secondary"></div>';

        self::assertSame($expected, Bootstrap6ContentMigrationService::migrateHtmlFragment($input));
    }

    #[Test]
    public function migrateHtmlFragmentReplacesModalAndMenuAttributes(): void
    {
        $input = '<a data-bs-toggle="modal" data-bs-dismiss="modal"></a><ul class="dropdown-menu"><li class="dropdown-item"></li></ul>';
        $out = Bootstrap6ContentMigrationService::migrateHtmlFragment($input);

        self::assertStringContainsString('data-bs-toggle="dialog"', $out);
        self::assertStringContainsString('data-bs-dismiss="dialog"', $out);
        self::assertStringContainsString('class="menu"', $out);
        self::assertStringContainsString('class="menu-item"', $out);
    }
}
