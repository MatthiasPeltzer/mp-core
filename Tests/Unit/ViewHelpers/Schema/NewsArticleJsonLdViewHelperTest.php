<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers\Schema;

use Mpc\MpCore\ViewHelpers\Schema\NewsArticleJsonLdViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

#[CoversClass(NewsArticleJsonLdViewHelper::class)]
final class NewsArticleJsonLdViewHelperTest extends TestCase
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
     * @param array<string, mixed> $arguments
     */
    private function render(array $arguments): string
    {
        $renderingContext = $this->createMock(RenderingContextInterface::class);
        $renderingContext->method('hasAttribute')->willReturn(false);

        $viewHelper = new NewsArticleJsonLdViewHelper();
        $viewHelper->setRenderingContext($renderingContext);
        $viewHelper->setArguments(array_merge([
            'articleUrl' => 'https://example.com/news/1',
            'headline' => 'Headline',
            'description' => '',
            'datePublished' => '',
            'dateModified' => '',
            'imageUrl' => '',
            'author' => '',
            'publisherName' => '',
        ], $arguments));

        return $viewHelper->render();
    }

    #[Test]
    public function buildsMinimalNewsArticle(): void
    {
        $data = json_decode($this->render([]), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame('https://schema.org', $data['@context']);
        self::assertSame('NewsArticle', $data['@type']);
        self::assertSame('Headline', $data['headline']);
        self::assertSame('https://example.com/news/1', $data['url']);
        self::assertSame('https://example.com/news/1', $data['mainEntityOfPage']);
        self::assertArrayNotHasKey('description', $data);
        self::assertArrayNotHasKey('datePublished', $data);
        self::assertArrayNotHasKey('image', $data);
        self::assertArrayNotHasKey('publisher', $data);
        self::assertArrayNotHasKey('author', $data);
    }

    #[Test]
    public function emitsAuthorAsPersonWhenProvided(): void
    {
        $data = json_decode($this->render(['author' => 'Jane Doe']), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(['@type' => 'Person', 'name' => 'Jane Doe'], $data['author']);
        self::assertSame('https://example.com/news/1', $data['mainEntityOfPage']);
    }

    #[Test]
    public function includesOptionalFieldsWhenProvided(): void
    {
        $data = json_decode($this->render([
            'description' => 'A teaser.',
            'datePublished' => '2026-01-01T10:00:00+00:00',
            'dateModified' => '2026-01-02T10:00:00+00:00',
            'imageUrl' => 'https://example.com/img.jpg',
            'publisherName' => 'Acme',
        ]), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame('A teaser.', $data['description']);
        self::assertSame('2026-01-01T10:00:00+00:00', $data['datePublished']);
        self::assertSame('2026-01-02T10:00:00+00:00', $data['dateModified']);
        self::assertSame('https://example.com/img.jpg', $data['image']);
        // Without a Site, publisher type defaults to Person.
        self::assertSame(['@type' => 'Person', 'name' => 'Acme'], $data['publisher']);
    }

    #[Test]
    public function truncatesDescriptionTo500Characters(): void
    {
        $data = json_decode($this->render([
            'description' => str_repeat('a', 600),
        ]), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(500, mb_strlen($data['description']));
    }

    #[Test]
    public function encodesHtmlSpecialCharactersToHexEscapes(): void
    {
        $json = $this->render(['headline' => 'Breaking</script>']);

        self::assertStringNotContainsString('<', $json);
        self::assertStringNotContainsString('>', $json);

        $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Breaking</script>', $data['headline']);
    }
}
