<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers\Format;

use Mpc\MpCore\ViewHelpers\Format\CssColorViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(CssColorViewHelper::class)]
final class CssColorViewHelperTest extends TestCase
{
    private function render(mixed $value): string
    {
        $viewHelper = new CssColorViewHelper();
        $viewHelper->setArguments(['value' => $value]);

        return $viewHelper->render();
    }

    /**
     * @return iterable<string, array{0: string}>
     */
    public static function validColorProvider(): iterable
    {
        yield 'hex' => ['#ffffff'];
        yield 'short hex' => ['#fff'];
        yield 'named' => ['red'];
        yield 'modern rgb' => ['rgb(0 0 0 / 50%)'];
    }

    #[Test]
    #[DataProvider('validColorProvider')]
    public function emitsValidColorVerbatim(string $value): void
    {
        self::assertSame($value, $this->render($value));
    }

    #[Test]
    public function trimsBeforeEmitting(): void
    {
        self::assertSame('#fff', $this->render('  #fff  '));
    }

    /**
     * @return iterable<string, array{0: mixed}>
     */
    public static function invalidValueProvider(): iterable
    {
        yield 'css breakout' => ['red; } body { display:none } a {'];
        yield 'function name' => ['expression(1)'];
        yield 'empty' => [''];
        yield 'non-string' => [123];
    }

    #[Test]
    #[DataProvider('invalidValueProvider')]
    public function returnsEmptyStringForInvalidValues(mixed $value): void
    {
        self::assertSame('', $this->render($value));
    }
}
