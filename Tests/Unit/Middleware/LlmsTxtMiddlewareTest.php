<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Middleware;

use Mpc\MpCore\Middleware\LlmsTxtMiddleware;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UriInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Http\Uri;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;

#[CoversClass(LlmsTxtMiddleware::class)]
final class LlmsTxtMiddlewareTest extends TestCase
{
    /**
     * @param array<string, mixed> $page
     */
    private function resolvePageDescription(array $page): string
    {
        $middleware = new LlmsTxtMiddleware(
            $this->createMock(PageRepository::class),
            $this->createMock(FrontendInterface::class)
        );

        return (new \ReflectionMethod(LlmsTxtMiddleware::class, 'resolvePageDescription'))
            ->invoke($middleware, $page);
    }

    #[Test]
    public function pageDescriptionStripsTagsAndCollapsesWhitespace(): void
    {
        self::assertSame('Hello world', $this->resolvePageDescription(['description' => "<p>Hello \n  <b>world</b></p>"]));
    }

    #[Test]
    public function pageDescriptionFallsBackToAbstract(): void
    {
        self::assertSame('From abstract', $this->resolvePageDescription(['description' => '', 'abstract' => 'From abstract']));
    }

    #[Test]
    public function pageDescriptionIsTruncated(): void
    {
        $result = $this->resolvePageDescription(['description' => str_repeat('a', 200)]);

        self::assertLessThanOrEqual(160, mb_strlen($result));
        self::assertStringEndsWith('...', $result);
    }

    #[Test]
    public function emptyPageDescriptionReturnsEmptyString(): void
    {
        self::assertSame('', $this->resolvePageDescription(['description' => '   ']));
    }

    /**
     * @param array<string, mixed> $settingsTree
     */
    private function site(array $settingsTree = [], string $websiteTitle = 'Acme'): Site
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('getLanguageId')->willReturn(0);

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getConfiguration')->willReturn(['websiteTitle' => $websiteTitle]);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree($settingsTree));
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getDefaultLanguage')->willReturn($language);

        return $site;
    }

    private function request(string $path, ?Site $site): ServerRequestInterface
    {
        $uri = $this->createMock(UriInterface::class);
        $uri->method('getPath')->willReturn($path);
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getUri')->willReturn($uri);
        $request->method('getAttribute')->willReturnMap([
            ['site', null, $site],
            ['language', null, null],
        ]);

        return $request;
    }

    private function passthroughHandler(): RequestHandlerInterface
    {
        $handler = $this->createMock(RequestHandlerInterface::class);
        $handler->method('handle')->willReturn(new HtmlResponse('passthrough'));

        return $handler;
    }

    private function middleware(FrontendInterface $cache, PageRepository $pageRepository): LlmsTxtMiddleware
    {
        return new LlmsTxtMiddleware($pageRepository, $cache);
    }

    private function bodyOf(ResponseInterface $response): string
    {
        return (string)$response->getBody();
    }

    #[Test]
    public function passesThroughForNonMatchingPath(): void
    {
        $middleware = $this->middleware(
            $this->createMock(FrontendInterface::class),
            $this->createMock(PageRepository::class)
        );

        $response = $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function passesThroughWhenDisabled(): void
    {
        $middleware = $this->middleware(
            $this->createMock(FrontendInterface::class),
            $this->createMock(PageRepository::class)
        );
        $site = $this->site(['seo' => ['llmsTxt' => ['enabled' => false]]]);

        $response = $middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function buildsMarkdownOnCacheMiss(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $cache->expects(self::once())->method('set');

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $response = $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('text/markdown', $response->getHeaderLine('Content-Type'));
        self::assertStringContainsString('# Acme', $body);
        self::assertStringContainsString('## Sitemap', $body);
        self::assertStringContainsString('https://example.com/sitemap.xml', $body);
    }

    #[Test]
    public function servesCachedContentWithoutRebuilding(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn("# Cached\n");
        $cache->expects(self::never())->method('set');

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->expects(self::never())->method('getMenu');

        $middleware = $this->middleware($cache, $pageRepository);
        $response = $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());

        self::assertSame("# Cached\n", $this->bodyOf($response));
    }
}
