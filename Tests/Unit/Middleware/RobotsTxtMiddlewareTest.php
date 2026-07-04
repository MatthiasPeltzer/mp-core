<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Middleware;

use Mpc\MpCore\Middleware\RobotsTxtMiddleware;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UriInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Http\Uri;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;

#[CoversClass(RobotsTxtMiddleware::class)]
final class RobotsTxtMiddlewareTest extends TestCase
{
    /**
     * @param array<string, mixed> $settingsTree
     */
    private function site(array $settingsTree = []): Site
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('getLanguageId')->willReturn(0);

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree($settingsTree));
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

    private function bodyOf(ResponseInterface $response): string
    {
        return (string)$response->getBody();
    }

    #[Test]
    public function passesThroughWhenNoSite(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $middleware = new RobotsTxtMiddleware($cache);

        $response = $middleware->process($this->request('/robots.txt', null), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function passesThroughForNonMatchingPath(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $middleware = new RobotsTxtMiddleware($cache);

        $response = $middleware->process($this->request('/sitemap.xml', $this->site()), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function passesThroughWhenDisabled(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $middleware = new RobotsTxtMiddleware($cache);
        $site = $this->site(['seo' => ['robots' => ['enabled' => false]]]);

        $response = $middleware->process($this->request('/robots.txt', $site), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function buildsAndCachesRobotsTxtOnCacheMiss(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $cache->expects(self::once())->method('set');

        $middleware = new RobotsTxtMiddleware($cache);
        $response = $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('text/plain', $response->getHeaderLine('Content-Type'));
        self::assertStringContainsString('User-agent: *', $body);
        self::assertStringContainsString('Disallow: /typo3/', $body);
        self::assertStringContainsString('Sitemap: https://example.com/sitemap.xml', $body);
    }

    #[Test]
    public function includesTempDirAndParameterizedUrlRules(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $middleware = new RobotsTxtMiddleware($cache);
        $response = $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('Disallow: /typo3temp/', $body);
        self::assertStringContainsString('Disallow: /fileadmin/_processed_/', $body);
        self::assertStringContainsString('Disallow: /*?cHash=', $body);
        self::assertStringContainsString('Disallow: /*?tx_', $body);
    }

    #[Test]
    public function rendersHeaderCommentWithSiteHostFallback(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $middleware = new RobotsTxtMiddleware($cache);
        $response = $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler());

        self::assertStringStartsWith('# robots.txt for example.com', $this->bodyOf($response));
    }

    #[Test]
    public function emitsCrawlDelayOnlyWhenConfigured(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $middleware = new RobotsTxtMiddleware($cache);

        $without = $this->bodyOf(
            $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler())
        );
        self::assertStringNotContainsString('Crawl-delay:', $without);

        $withDelay = $this->bodyOf($middleware->process(
            $this->request('/robots.txt', $this->site(['seo' => ['robots' => ['crawlDelay' => 10]]])),
            $this->passthroughHandler()
        ));
        self::assertStringContainsString('Crawl-delay: 10', $withDelay);
    }

    #[Test]
    public function listsOneSitemapPerEnabledLanguage(): void
    {
        $de = $this->createMock(SiteLanguage::class);
        $de->method('getBase')->willReturn(new Uri('https://example.com/'));
        $en = $this->createMock(SiteLanguage::class);
        $en->method('getBase')->willReturn(new Uri('https://example.com/en/'));

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree([]));
        $site->method('getDefaultLanguage')->willReturn($de);
        $site->method('getLanguages')->willReturn([$de, $en]);

        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $middleware = new RobotsTxtMiddleware($cache);

        $body = $this->bodyOf($middleware->process($this->request('/robots.txt', $site), $this->passthroughHandler()));

        self::assertStringContainsString('Sitemap: https://example.com/sitemap.xml', $body);
        self::assertStringContainsString('Sitemap: https://example.com/en/sitemap.xml', $body);
    }

    #[Test]
    public function disallowsAiCrawlersWhenConfigured(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $middleware = new RobotsTxtMiddleware($cache);
        $site = $this->site(['seo' => ['robots' => ['allowAiBots' => false]]]);
        $response = $middleware->process($this->request('/robots.txt', $site), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('User-agent: GPTBot', $body);
        self::assertStringContainsString('User-agent: ClaudeBot', $body);
    }

    #[Test]
    public function appendsAdditionalRules(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $middleware = new RobotsTxtMiddleware($cache);
        $site = $this->site(['seo' => ['robots' => ['additional' => 'Disallow: /secret/']]]);
        $response = $middleware->process($this->request('/robots.txt', $site), $this->passthroughHandler());

        self::assertStringContainsString('Disallow: /secret/', $this->bodyOf($response));
    }

    #[Test]
    public function servesCachedContentWithoutRebuilding(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn("cached robots\n");
        $cache->expects(self::never())->method('set');

        $middleware = new RobotsTxtMiddleware($cache);
        $response = $middleware->process($this->request('/robots.txt', $this->site()), $this->passthroughHandler());

        self::assertSame("cached robots\n", $this->bodyOf($response));
    }
}
