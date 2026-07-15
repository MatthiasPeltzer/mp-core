<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\Configuration;

use Mpc\MpCore\Tests\Support\MpCoreTcaManifest;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Schema\TcaSchemaFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class TcaBootstrapFunctionalTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = MpCoreTcaManifest::CORE_EXTENSIONS_TO_LOAD;

    protected array $testExtensionsToLoad = MpCoreTcaManifest::FUNCTIONAL_TEST_EXTENSIONS;

    #[Test]
    public function customTablesAreRegisteredInTca(): void
    {
        foreach (MpCoreTcaManifest::CUSTOM_TABLES as $table) {
            self::assertArrayHasKey($table, $GLOBALS['TCA'], sprintf('Missing TCA table "%s".', $table));
            self::assertArrayHasKey('ctrl', $GLOBALS['TCA'][$table]);
            self::assertArrayHasKey('columns', $GLOBALS['TCA'][$table]);
            self::assertArrayHasKey('types', $GLOBALS['TCA'][$table]);
        }
    }

    #[Test]
    public function contentTypesAreRegisteredInTtContent(): void
    {
        foreach (MpCoreTcaManifest::C_TYPES as $cType) {
            self::assertArrayHasKey(
                $cType,
                $GLOBALS['TCA']['tt_content']['types'],
                sprintf('Missing tt_content type "%s".', $cType),
            );
        }
    }

    #[Test]
    public function contentTypeIconsAreRegisteredWhereExpected(): void
    {
        $typeIcons = $GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes'] ?? [];
        self::assertIsArray($typeIcons);

        foreach (MpCoreTcaManifest::C_TYPE_ICONS as $cType => $icon) {
            self::assertSame(
                $icon,
                $typeIcons[$cType] ?? null,
                sprintf('Unexpected or missing typeicon for CType "%s".', $cType),
            );
        }
    }

    #[Test]
    public function tcaSchemaBuildsForMpCoreTables(): void
    {
        $factory = GeneralUtility::makeInstance(TcaSchemaFactory::class);

        foreach (MpCoreTcaManifest::SCHEMA_TABLES as $table) {
            self::assertTrue(
                $factory->has($table),
                sprintf('TcaSchemaFactory has no schema for table "%s".', $table),
            );
            $schema = $factory->get($table);
            self::assertSame($table, $schema->getName());
        }
    }

    #[Test]
    public function coreTableOverridesExposeMpCoreColumns(): void
    {
        foreach (MpCoreTcaManifest::OVERRIDDEN_CORE_TABLE_COLUMNS as $table => $columns) {
            self::assertArrayHasKey($table, $GLOBALS['TCA'], sprintf('Missing overridden table "%s".', $table));

            foreach ($columns as $column) {
                self::assertArrayHasKey(
                    $column,
                    $GLOBALS['TCA'][$table]['columns'],
                    sprintf('Missing column "%s" on table "%s".', $column, $table),
                );
            }
        }
    }

    #[Test]
    public function previewRendererIsRegisteredOnTtContent(): void
    {
        self::assertSame(
            MpCoreTcaManifest::PREVIEW_RENDERER_CLASS,
            $GLOBALS['TCA']['tt_content']['ctrl']['previewRenderer'] ?? null,
        );
    }

    #[Test]
    public function colorPickerUsesItemsProcFuncOnGridBgcolor(): void
    {
        $config = $GLOBALS['TCA']['tt_content']['columns']['grid_bgcolor']['config'] ?? null;
        self::assertIsArray($config);
        self::assertSame(
            MpCoreTcaManifest::COLOR_PICKER_ITEMS_PROC_CLASS . '->getItems',
            $config['itemsProcFunc'] ?? null,
        );
    }
}
