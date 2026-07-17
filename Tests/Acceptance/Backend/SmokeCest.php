<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Acceptance\Backend;

use Mpc\MpCore\Tests\Acceptance\Support\BackendTester;

final class SmokeCest
{
    public function _before(BackendTester $I): void
    {
        $I->useExistingSession('admin');
    }

    public function backendToolbarIsVisible(BackendTester $I): void
    {
        $I->seeElement('.t3js-scaffold-toolbar');
    }
}
