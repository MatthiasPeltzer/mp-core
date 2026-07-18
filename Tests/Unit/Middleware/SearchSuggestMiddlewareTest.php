<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Middleware;

use Mpc\MpCore\Middleware\SearchSuggestMiddleware;
use Mpc\MpCore\Search\SearchSuggestService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\UriInterface;
use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Routing\RouterInterface;
use TYPO3\CMS\Core\Site\Entity\Site;

#[CoversClass(SearchSuggestMiddleware::class)]
final class SearchSuggestMiddlewareTest extends TestCase
{
    /**
     * @param array<string, mixed> $page
     */
    private function buildPageUrl(Site $site, array $page): ?string
    {
        $middleware = new SearchSuggestMiddleware(new SearchSuggestService(
            $this->createMock(ConnectionPool::class),
            $this->createMock(Context::class),
        ));

        return (new \ReflectionMethod(SearchSuggestMiddleware::class, 'buildPageUrl'))
            ->invoke($middleware, $site, $page);
    }

    #[Test]
    public function buildPageUrlIncludesStaticRouteArguments(): void
    {
        $router = $this->createMock(RouterInterface::class);
        $router->expects(self::once())
            ->method('generateUri')
            ->with(
                438,
                [
                    '_language' => 0,
                    'media' => '27',
                ]
            )
            ->willReturn($this->createConfiguredMock(UriInterface::class, ['__toString' => 'https://example.com/mediathek/hazed-and-dreadful']));

        $site = $this->createMock(Site::class);
        $site->method('getRouter')->willReturn($router);

        $url = $this->buildPageUrl($site, [
            'title' => 'Example',
            'pageId' => 438,
            'pageType' => 0,
            'mountPoint' => '',
            'staticPageArguments' => ['media' => '27'],
            'languageId' => 0,
        ]);

        self::assertSame('https://example.com/mediathek/hazed-and-dreadful', $url);
    }

    #[Test]
    public function buildPageUrlAddsMountPointAndPageType(): void
    {
        $router = $this->createMock(RouterInterface::class);
        $router->expects(self::once())
            ->method('generateUri')
            ->with(
                12,
                [
                    '_language' => 1,
                    'MP' => '5-12',
                    'type' => '123',
                    'media' => '9',
                ]
            )
            ->willReturn($this->createConfiguredMock(UriInterface::class, ['__toString' => 'https://example.com/detail/example']));

        $site = $this->createMock(Site::class);
        $site->method('getRouter')->willReturn($router);

        $url = $this->buildPageUrl($site, [
            'title' => 'Example',
            'pageId' => 12,
            'pageType' => 123,
            'mountPoint' => '5-12',
            'staticPageArguments' => ['media' => '9'],
            'languageId' => 1,
        ]);

        self::assertSame('https://example.com/detail/example', $url);
    }

    #[Test]
    public function buildPageUrlReturnsNullForInvalidPageId(): void
    {
        $site = $this->createMock(Site::class);
        $site->expects(self::never())->method('getRouter');

        self::assertNull($this->buildPageUrl($site, [
            'title' => 'Example',
            'pageId' => 0,
            'pageType' => 0,
            'mountPoint' => '',
            'staticPageArguments' => [],
            'languageId' => 0,
        ]));
    }
}
