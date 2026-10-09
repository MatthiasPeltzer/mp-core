<?php

declare(strict_types=1);

namespace Mpc\MpCore\Upgrades;

use Mpc\MpCore\Service\Bootstrap6ContentMigrationService;
use TYPO3\CMS\Install\Attribute\UpgradeWizard;
use TYPO3\CMS\Install\Updates\DatabaseUpdatedPrerequisite;
use TYPO3\CMS\Install\Updates\UpgradeWizardInterface;

#[UpgradeWizard('mpcMpCoreBootstrap6RteHtml')]
final readonly class Bootstrap6RteHtmlUpgradeWizard implements UpgradeWizardInterface
{
    public function __construct(
        private Bootstrap6ContentMigrationService $migrationService,
    ) {}

    public function getTitle(): string
    {
        return 'MP Core: Migrate RTE HTML fields to Bootstrap 6 markup';
    }

    public function getDescription(): string
    {
        $pending = $this->migrationService->findHtmlRecordsNeedingMigration();
        if ($pending === []) {
            return 'No bodytext / link text fields contain known Bootstrap 5 patterns.';
        }

        return sprintf(
            'Updates stored HTML in %d tt_content field(s): buttons, grid utilities, modal/menu data attributes, and related v5 classes.',
            count($pending)
        );
    }

    public function updateNecessary(): bool
    {
        return $this->migrationService->findHtmlRecordsNeedingMigration() !== [];
    }

    public function executeUpdate(): bool
    {
        $this->migrationService->migrateAllHtmlFields();

        return true;
    }

    public function getPrerequisites(): array
    {
        return [
            DatabaseUpdatedPrerequisite::class,
        ];
    }
}
