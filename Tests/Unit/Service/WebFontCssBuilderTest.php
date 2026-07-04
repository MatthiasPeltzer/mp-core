<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\WebFontCssBuilder;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(WebFontCssBuilder::class)]
final class WebFontCssBuilderTest extends TestCase
{
    private WebFontCssBuilder $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new WebFontCssBuilder();
    }

    /**
     * @param list<array<string, string>> $faces
     * @return array{name: string, fallback: string, role: string, cssVariable: string, fontDisplay: string, faces: list<array<string, string>>}
     */
    private function family(
        string $name = 'Roboto',
        string $fallback = '',
        string $role = 'body',
        string $cssVariable = '',
        string $fontDisplay = 'swap',
        array $faces = [],
    ): array {
        if ($faces === []) {
            $faces = [$this->face()];
        }

        return [
            'name' => $name,
            'fallback' => $fallback,
            'role' => $role,
            'cssVariable' => $cssVariable,
            'fontDisplay' => $fontDisplay,
            'faces' => $faces,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function face(
        string $url = '/fileadmin/fonts/roboto.woff2',
        string $extension = 'woff2',
        string $weight = '400',
        string $style = 'normal',
        string $unicodeRange = '',
    ): array {
        return [
            'url' => $url,
            'extension' => $extension,
            'weight' => $weight,
            'style' => $style,
            'unicodeRange' => $unicodeRange,
        ];
    }

    #[Test]
    public function emptyFamilyListProducesNoCss(): void
    {
        self::assertSame('', $this->subject->build([]));
    }

    #[Test]
    public function buildsFontFaceAndRootMappingForBodyRole(): void
    {
        $css = $this->subject->build([$this->family()]);

        self::assertStringContainsString('@font-face {', $css);
        self::assertStringContainsString('font-family: "Roboto"', $css);
        self::assertStringContainsString('src: url("/fileadmin/fonts/roboto.woff2") format("woff2")', $css);
        self::assertStringContainsString('font-weight: 400', $css);
        self::assertStringContainsString('font-style: normal', $css);
        self::assertStringContainsString('font-display: swap', $css);
        self::assertStringContainsString(':root {', $css);
        self::assertStringContainsString('--bs-body-font-family: "Roboto";', $css);
    }

    #[Test]
    public function stripsDangerousCharactersFromFamilyName(): void
    {
        // The sanitizer removes the quote/brace/angle-bracket breakout
        // characters; `Ro"bo}<to>` collapses to a clean `Roboto`.
        $css = $this->subject->build([$this->family(name: 'Ro"bo}<to>')]);

        self::assertStringContainsString('font-family: "Roboto"', $css);
        self::assertStringNotContainsString('Ro"bo', $css);
        self::assertStringNotContainsString('}<to', $css);
        self::assertStringNotContainsString('<to>', $css);
    }

    #[Test]
    public function dropsFamilyWhenFileExtensionIsNotAllowed(): void
    {
        $css = $this->subject->build([
            $this->family(faces: [$this->face(url: '/fileadmin/fonts/x.ttf', extension: 'ttf')]),
        ]);

        self::assertSame('', $css);
    }

    #[Test]
    public function rejectsUrlWithBreakoutCharacters(): void
    {
        $css = $this->subject->build([
            $this->family(faces: [$this->face(url: '/fileadmin/fonts/x").evil{.woff2')]),
        ]);

        self::assertSame('', $css);
    }

    #[Test]
    public function rejectsDataUri(): void
    {
        $css = $this->subject->build([
            $this->family(faces: [$this->face(url: 'data:font/woff2;base64,AAAA')]),
        ]);

        self::assertSame('', $css);
    }

    #[Test]
    public function normalizesInvalidWeightStyleAndDisplayToDefaults(): void
    {
        $css = $this->subject->build([
            $this->family(
                fontDisplay: 'nonsense',
                faces: [$this->face(weight: '123', style: 'oblique')],
            ),
        ]);

        self::assertStringContainsString('font-weight: 400', $css);
        self::assertStringContainsString('font-style: normal', $css);
        self::assertStringContainsString('font-display: swap', $css);
    }

    #[Test]
    public function appendsValidUnicodeRange(): void
    {
        $css = $this->subject->build([
            $this->family(faces: [$this->face(unicodeRange: 'U+0-7F, U+1E00-1EFF')]),
        ]);

        self::assertStringContainsString('unicode-range: U+0-7F, U+1E00-1EFF', $css);
    }

    #[Test]
    public function dropsInvalidUnicodeRange(): void
    {
        $css = $this->subject->build([
            $this->family(faces: [$this->face(unicodeRange: 'U+0-7F; color:red')]),
        ]);

        self::assertStringNotContainsString('unicode-range', $css);
    }

    #[Test]
    public function customRoleUsesValidatedCssVariable(): void
    {
        $css = $this->subject->build([
            $this->family(role: 'custom', cssVariable: '--my-font'),
        ]);

        self::assertStringContainsString('--my-font: "Roboto";', $css);
    }

    #[Test]
    public function customRoleWithInvalidCssVariableEmitsNoRootMapping(): void
    {
        $css = $this->subject->build([
            $this->family(role: 'custom', cssVariable: 'my-font'),
        ]);

        self::assertStringContainsString('@font-face {', $css);
        self::assertStringNotContainsString(':root', $css);
    }

    #[Test]
    public function includesSanitizedFallbackStack(): void
    {
        $css = $this->subject->build([
            $this->family(fallback: 'Arial, sans-serif'),
        ]);

        self::assertStringContainsString('--bs-body-font-family: "Roboto", Arial, sans-serif;', $css);
    }
}
