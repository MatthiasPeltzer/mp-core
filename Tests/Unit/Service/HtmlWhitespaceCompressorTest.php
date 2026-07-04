<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\HtmlWhitespaceCompressor;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(HtmlWhitespaceCompressor::class)]
final class HtmlWhitespaceCompressorTest extends TestCase
{
    private HtmlWhitespaceCompressor $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new HtmlWhitespaceCompressor();
    }

    #[Test]
    public function stripsNewlineIndentationBetweenTags(): void
    {
        $html = "<div>\n    <a>x</a>\n</div>";

        self::assertSame('<div><a>x</a></div>', $this->subject->compress($html));
    }

    #[Test]
    public function keepsSingleSpaceBetweenInlineElements(): void
    {
        $html = '<strong>foo</strong> <em>bar</em>';

        self::assertSame($html, $this->subject->compress($html));
    }

    #[Test]
    public function preservesScriptContentByteForByte(): void
    {
        $html = "<div>\n<script>\n  var x = 1;\n</script>\n</div>";

        $result = $this->subject->compress($html);

        self::assertStringContainsString("<script>\n  var x = 1;\n</script>", $result);
    }

    #[Test]
    public function preservesPreContent(): void
    {
        $html = "<div>\n<pre>a\n    b\n  c</pre>\n</div>";

        $result = $this->subject->compress($html);

        self::assertStringContainsString("<pre>a\n    b\n  c</pre>", $result);
    }

    #[Test]
    public function preservesHtmlComments(): void
    {
        $html = "<div>\n<!-- TYPO3SEARCH_begin -->\ncontent\n<!-- TYPO3SEARCH_end -->\n</div>";

        $result = $this->subject->compress($html);

        self::assertStringContainsString('<!-- TYPO3SEARCH_begin -->', $result);
        self::assertStringContainsString('<!-- TYPO3SEARCH_end -->', $result);
    }

    #[Test]
    public function collapsesWhitespaceRunsWithoutNewlineToSingleSpace(): void
    {
        $html = 'a     b';

        self::assertSame('a b', $this->subject->compress($html));
    }

    /**
     * @return array<string, array{0: string, 1: bool}>
     */
    public static function contentTypeProvider(): array
    {
        return [
            'empty is treated as html' => ['', true],
            'text/html' => ['text/html', true],
            'text/html with charset' => ['text/html; charset=utf-8', true],
            'uppercase' => ['TEXT/HTML', true],
            'json' => ['application/json', false],
            'xml' => ['application/xml', false],
            'plain text' => ['text/plain', false],
        ];
    }

    #[Test]
    #[DataProvider('contentTypeProvider')]
    public function detectsHtmlContentType(string $contentType, bool $expected): void
    {
        self::assertSame($expected, $this->subject->isHtmlContentType($contentType));
    }
}
