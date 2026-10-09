<?php

declare(strict_types=1);

namespace Mpc\MpCore\Upgrades;

use Mpc\MpCore\Service\Bootstrap6ContentMigrationService;
use TYPO3\CMS\Install\Attribute\UpgradeWizard;
use TYPO3\CMS\Install\Updates\DatabaseUpdatedPrerequisite;
use TYPO3\CMS\Install\Updates\UpgradeWizardInterface;

#[UpgradeWizard('mpcMpCoreBootstrap6LinkLayout')]
final readonly class Bootstrap6LinkLayoutUpgradeWizard implements UpgradeWizardInterface
{
    public function __construct(
        private Bootstrap6ContentMigrationService $migrationService,
    ) {}

    public function getTitle(): string
    {
        return 'MP Core: Migrate tx_link_layout button classes to Bootstrap 6';
    }

    public function getDescription(): string
    {
        $pending = $this->migrationService->findLinkLayoutRecordsNeedingMigration();
        if ($pending === []) {
            return 'All tx_link_layout values already use Bootstrap 6 button classes (btn-solid theme-*).';
        }

        return sprintf(
            'Updates %d content element(s): replaces legacy `btn btn-primary/secondary/…` with `btn btn-solid theme-*`.',
            count($pending)
        );
    }

    public function updateNecessary(): bool
    {
        return $this->migrationService->findLinkLayoutRecordsNeedingMigration() !== [];
    }

    public function executeUpdate(): bool
    {
        $this->migrationService->migrateAllLinkLayouts();

        return true;
    }

    public function getPrerequisites(): array
    {
        return [
            DatabaseUpdatedPrerequisite::class,
        ];
    }
}
