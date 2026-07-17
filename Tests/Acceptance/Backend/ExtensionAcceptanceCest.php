<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Acceptance\Backend;

use Mpc\MpCore\Tests\Acceptance\Support\BackendTester;

final class ExtensionAcceptanceCest
{
    public function _before(BackendTester $I): void
    {
        $I->useExistingSession('admin');
    }

    public function definitionListContentBlockAppearsInWizard(BackendTester $I): void
    {
        $I->openPageLayoutModule(2);
        $I->openNewContentElementWizard();
        $I->seeNewRecordWizardItem('List of definitions', 'lists');
    }
}
