<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers\Schema;

use Mpc\MpCore\ViewHelpers\Schema\FaqPageJsonLdViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

#[CoversClass(FaqPageJsonLdViewHelper::class)]
final class FaqPageJsonLdViewHelperTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        unset($GLOBALS['TYPO3_REQUEST']);
    }

    protected function tearDown(): void
    {
        unset($GLOBALS['TYPO3_REQUEST']);
        parent::tearDown();
    }

    /**
     * @param array<int, array<string, mixed>> $items
     */
    private function render(array $items): string
    {
        $renderingContext = $this->createMock(RenderingContextInterface::class);
        $renderingContext->method('hasAttribute')->willReturn(false);

        $viewHelper = new FaqPageJsonLdViewHelper();
        $viewHelper->setRenderingContext($renderingContext);
        $viewHelper->setArguments(['items' => $items]);

        return $viewHelper->render();
    }

    #[Test]
    public function buildsFaqPagePayloadFromItems(): void
    {
        $json = $this->render([
            ['header' => 'What is it?', 'bodytext' => '<p>An <b>answer</b>.</p>'],
            ['header' => 'Second?', 'bodytext' => 'Plain answer.'],
        ]);

        $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

        self::assertSame('https://schema.org', $data['@context']);
        self::assertSame('FAQPage', $data['@type']);
        self::assertCount(2, $data['mainEntity']);
        self::assertSame('Question', $data['mainEntity'][0]['@type']);
        self::assertSame('What is it?', $data['mainEntity'][0]['name']);
        self::assertSame('Answer', $data['mainEntity'][0]['acceptedAnswer']['@type']);
        // HTML is reduced to plain text.
        self::assertSame('An answer.', $data['mainEntity'][0]['acceptedAnswer']['text']);
    }

    #[Test]
    public function returnsEmptyStringWhenNoValidQuestions(): void
    {
        self::assertSame('', $this->render([]));
        self::assertSame('', $this->render([['header' => 'Q only', 'bodytext' => '']]));
        self::assertSame('', $this->render([['header' => '', 'bodytext' => 'A only']]));
    }

    #[Test]
    public function skipsInvalidAndIncompleteItems(): void
    {
        $json = $this->render([
            'not-an-array',
            ['header' => 'Valid?', 'bodytext' => 'Yes.'],
            ['header' => '', 'bodytext' => 'no header'],
        ]);

        $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

        self::assertCount(1, $data['mainEntity']);
        self::assertSame('Valid?', $data['mainEntity'][0]['name']);
    }

    #[Test]
    public function encodesHtmlSpecialCharactersToHexEscapes(): void
    {
        $json = $this->render([
            ['header' => 'Break</script>?', 'bodytext' => 'Ok.'],
        ]);

        // JSON_HEX_* flags prevent raw angle brackets/quotes reaching the DOM.
        self::assertStringNotContainsString('<', $json);
        self::assertStringNotContainsString('>', $json);
        // Value is still recoverable after decoding.
        $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Break</script>?', $data['mainEntity'][0]['name']);
    }

    #[Test]
    public function truncatesLongAnswers(): void
    {
        $json = $this->render([
            ['header' => 'Long?', 'bodytext' => str_repeat('a', 6000)],
        ]);

        $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(5000, mb_strlen($data['mainEntity'][0]['acceptedAnswer']['text']));
    }
}
