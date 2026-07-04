<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\CssColorValidator;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(CssColorValidator::class)]
final class CssColorValidatorTest extends TestCase
{
    /**
     * @return array<string, array{0: string}>
     */
    public static function validColorProvider(): array
    {
        return [
            'named lowercase' => ['red'],
            'named uppercase' => ['RED'],
            'named mixed case' => ['CornflowerBlue'],
            'keyword transparent' => ['transparent'],
            'keyword currentcolor' => ['currentColor'],
            'keyword inherit' => ['inherit'],
            'hex 3' => ['#fff'],
            'hex 4' => ['#ffff'],
            'hex 6' => ['#ff8800'],
            'hex 8' => ['#ff8800aa'],
            'rgb legacy' => ['rgb(255, 136, 0)'],
            'rgba legacy' => ['rgba(255, 136, 0, 0.5)'],
            'rgb modern' => ['rgb(255 136 0 / 50%)'],
            'hsl' => ['hsl(120, 50%, 50%)'],
            'hsla' => ['hsla(120, 50%, 50%, 0.3)'],
            'padded whitespace trimmed' => ['  #abc  '],
        ];
    }

    #[Test]
    #[DataProvider('validColorProvider')]
    public function acceptsSafeColorValues(string $value): void
    {
        self::assertTrue(CssColorValidator::isValid($value));
    }

    /**
     * @return array<string, array{0: string}>
     */
    public static function invalidColorProvider(): array
    {
        return [
            'empty' => [''],
            'declaration breakout with semicolon' => ['red; }'],
            'brace breakout' => ['red}'],
            'open brace' => ['blue{'],
            'angle bracket' => ['red<script>'],
            'css comment open' => ['red/*'],
            'css comment close' => ['red*/'],
            'embedded newline' => ["re\nd"],
            'embedded carriage return' => ["re\rd"],
            'embedded tab' => ["re\td"],
            'embedded null byte' => ["re\0d"],
            'unknown keyword' => ['notacolor'],
            'invalid hex length' => ['#ff'],
            'invalid hex chars' => ['#gggggg'],
            'javascript uri' => ['javascript:alert(1)'],
            'url function' => ['url(x)'],
            'expression' => ['expression(1)'],
            'too long' => [str_repeat('a', 81)],
        ];
    }

    #[Test]
    #[DataProvider('invalidColorProvider')]
    public function rejectsUnsafeOrInvalidColorValues(string $value): void
    {
        self::assertFalse(CssColorValidator::isValid($value));
    }
}
