<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers;

use Mpc\MpCore\ViewHelpers\SvgInlineViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for the static SVG sanitization pipeline of
 * {@see SvgInlineViewHelper}. The public render() path needs an ImageService,
 * so the pure sanitizer is exercised through the protected static
 * `getInlineSvgCached()` (attribute normalization + DOM sanitization) via
 * reflection.
 */
#[CoversClass(SvgInlineViewHelper::class)]
final class SvgInlineViewHelperTest extends TestCase
{
    /**
     * @param array<string, mixed> $attributes
     */
    private function renderInline(string $svg, array $attributes = []): string
    {
        return (string)(new \ReflectionMethod(SvgInlineViewHelper::class, 'getInlineSvgCached'))
            ->invoke(null, $svg, $attributes);
    }

    #[Test]
    public function invalidMarkupReturnsEmptyString(): void
    {
        // Non-empty but unparseable input degrades to an empty string. (The
        // empty-string case is guarded upstream in render() before this path.)
        self::assertSame('', $this->renderInline('not xml at all'));
    }

    #[Test]
    public function removesDangerousContent(): void
    {
        $svg = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">
    <script>alert(2)</script>
    <rect x="0" y="0" width="10" height="10" onclick="evil()" />
    <image href="https://evil.example/x.png" />
    <use href="https://evil.example/sprite.svg#a" />
    <use href="#local" />
    <a href="javascript:alert(3)"><rect x="1" y="1" width="2" height="2" /></a>
</svg>
SVG;

        $result = $this->renderInline($svg);

        self::assertStringNotContainsString('<script', $result);
        self::assertStringNotContainsString('onload', $result);
        self::assertStringNotContainsString('onclick', $result);
        self::assertStringNotContainsString('evil.example', $result);
        self::assertStringNotContainsString('javascript:', $result);
        // Harmless geometry survives.
        self::assertStringContainsString('<rect', $result);
        // Same-document fragment reference is preserved.
        self::assertStringContainsString('#local', $result);
    }

    #[Test]
    public function appliesSafeAttributesToRootElement(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" /></svg>';

        $result = $this->renderInline($svg, [
            'id' => 'logo',
            'class' => 'icon',
        ]);

        self::assertStringContainsString('id="logo"', $result);
        self::assertStringContainsString('class="icon"', $result);
    }

    #[Test]
    public function stripsEventHandlerAttributesPassedByCaller(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" /></svg>';

        $result = $this->renderInline($svg, [
            'class' => 'icon',
            'onclick' => 'alert(1)',
            'onload' => 'alert(2)',
        ]);

        self::assertStringContainsString('class="icon"', $result);
        self::assertStringNotContainsString('onclick', $result);
        self::assertStringNotContainsString('onload', $result);
    }

    #[Test]
    public function expandsDataAttributes(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" /></svg>';

        $result = $this->renderInline($svg, [
            'data' => ['foo' => 'bar'],
        ]);

        self::assertStringContainsString('data-foo="bar"', $result);
    }

    #[Test]
    public function dropsRootAttributesOutsideAllowList(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" /></svg>';

        $result = $this->renderInline($svg, [
            'class' => 'icon',
            'style' => 'color:red',
            'href' => 'javascript:alert(1)',
            'xlink:href' => 'https://evil.example/sprite.svg#a',
            'formaction' => 'https://evil.example/',
        ]);

        // Allow-listed attributes survive.
        self::assertStringContainsString('class="icon"', $result);
        self::assertStringContainsString('style="color:red"', $result);
        // Everything outside the allow-list is dropped.
        self::assertStringNotContainsString('href', $result);
        self::assertStringNotContainsString('javascript:', $result);
        self::assertStringNotContainsString('evil.example', $result);
        self::assertStringNotContainsString('formaction', $result);
    }

    #[Test]
    public function keepsAriaAttributesOnRootElement(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" /></svg>';

        $result = $this->renderInline($svg, [
            'aria-hidden' => 'true',
            'role' => 'img',
        ]);

        self::assertStringContainsString('aria-hidden="true"', $result);
        self::assertStringContainsString('role="img"', $result);
    }
}
