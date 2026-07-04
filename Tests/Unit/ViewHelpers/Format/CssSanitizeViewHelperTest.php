<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers\Format;

use Mpc\MpCore\ViewHelpers\Format\CssSanitizeViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(CssSanitizeViewHelper::class)]
final class CssSanitizeViewHelperTest extends TestCase
{
    #[Test]
    public function keepsHarmlessCssUntouched(): void
    {
        $css = '.foo { color: #fff; background: rgb(0 0 0 / 50%); }';

        self::assertSame($css, CssSanitizeViewHelper::stripDangerousConstructs($css));
    }

    /**
     * @return iterable<string, array{0: string, 1: string}>
     */
    public static function dangerousInputProvider(): iterable
    {
        yield 'closing style tag' => ['a{}</style><script>alert(1)</script>', '</style'];
        yield 'script tag' => ['<script>x</script>', '<script'];
        yield '@import rule' => ['@import url(evil.css);', '@import'];
        yield 'expression()' => ['width: expression(alert(1));', 'expression('];
        yield 'javascript uri' => ['background:url(javascript:alert(1));', 'javascript:'];
        yield 'behavior' => ['behavior: url(evil.htc);', 'behavior:'];
    }

    #[Test]
    #[DataProvider('dangerousInputProvider')]
    public function stripsDangerousConstructs(string $input, string $mustNotContain): void
    {
        $result = CssSanitizeViewHelper::stripDangerousConstructs($input);

        self::assertStringNotContainsStringIgnoringCase($mustNotContain, $result);
    }

    /**
     * Nested/overlapping tokens must not be reconstructable after one pass.
     *
     * @return iterable<string, array{0: string, 1: string}>
     */
    public static function nestedBypassProvider(): iterable
    {
        yield 'nested closing style' => ['</sty</stylele>', '</style'];
        yield 'nested script' => ['<scr<scriptipt', '<script'];
        yield 'nested javascript uri' => ['javascjavascript:ript:', 'javascript:'];
        yield 'nested data url' => ['url(data:url(data:text/css', 'url(data:'];
    }

    #[Test]
    #[DataProvider('nestedBypassProvider')]
    public function isNotBypassableByNestedTokens(string $input, string $mustNotContain): void
    {
        $result = CssSanitizeViewHelper::stripDangerousConstructs($input);

        self::assertStringNotContainsStringIgnoringCase($mustNotContain, $result);
    }

    #[Test]
    public function renderReturnsEmptyStringForNonStringOrEmptyValue(): void
    {
        $viewHelper = new CssSanitizeViewHelper();

        $viewHelper->setArguments(['value' => '']);
        self::assertSame('', $viewHelper->render());

        // Non-string values are rejected without touching renderChildren().
        $viewHelper->setArguments(['value' => 123]);
        self::assertSame('', $viewHelper->render());
    }

    #[Test]
    public function renderSanitizesValueArgument(): void
    {
        $viewHelper = new CssSanitizeViewHelper();
        $viewHelper->setArguments(['value' => '.a{}</style><script>evil</script>']);

        $result = $viewHelper->render();

        self::assertStringNotContainsStringIgnoringCase('</style', $result);
        self::assertStringNotContainsStringIgnoringCase('<script', $result);
        self::assertStringContainsString('.a{}', $result);
    }
}
