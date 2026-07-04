<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Enum;

use Mpc\MpCore\Enum\StructuredDataExtraEntityType;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(StructuredDataExtraEntityType::class)]
final class StructuredDataExtraEntityTypeTest extends TestCase
{
    /**
     * @return iterable<string, array{0: StructuredDataExtraEntityType, 1: ?string}>
     */
    public static function keywordsSchemaPropertyProvider(): iterable
    {
        yield 'music group uses genre' => [StructuredDataExtraEntityType::MusicGroup, 'genre'];
        yield 'music person uses genre' => [StructuredDataExtraEntityType::MusicPerson, 'genre'];
        yield 'performing group uses knowsAbout' => [StructuredDataExtraEntityType::PerformingGroup, 'knowsAbout'];
        yield 'local business uses knowsAbout' => [StructuredDataExtraEntityType::LocalBusiness, 'knowsAbout'];
        yield 'ngo uses knowsAbout' => [StructuredDataExtraEntityType::NGO, 'knowsAbout'];
        yield 'none maps to null' => [StructuredDataExtraEntityType::None, null];
    }

    #[Test]
    #[DataProvider('keywordsSchemaPropertyProvider')]
    public function keywordsSchemaPropertyReturnsExpectedProperty(
        StructuredDataExtraEntityType $type,
        ?string $expected
    ): void {
        self::assertSame($expected, $type->keywordsSchemaProperty());
    }
}
