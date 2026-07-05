<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Middleware;

use Mpc\MpCore\Middleware\LlmsTxtMiddleware;
use Mpc\MpCore\Service\LanguageAwarePageRepositoryFactory;
use Mpc\MpCore\Service\LlmsTxtNewsProvider;
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
            $this->createMock(FrontendInterface::class),
            $this->emptyNewsProvider(),
            $this->createMock(LanguageAwarePageRepositoryFactory::class),
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
        $language->method('getBase')->willReturn(new Uri('https://example.com/'));

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getConfiguration')->willReturn(['websiteTitle' => $websiteTitle]);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree($settingsTree));
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getDefaultLanguage')->willReturn($language);
        $site->method('getLanguages')->willReturn([$language]);

        return $site;
    }

    /**
     * @return array{0: SiteLanguage, 1: SiteLanguage}
     */
    private function twoLanguages(): array
    {
        $de = $this->createMock(SiteLanguage::class);
        $de->method('getLanguageId')->willReturn(0);
        $de->method('getBase')->willReturn(new Uri('https://example.com/'));
        $de->method('getNavigationTitle')->willReturn('Deutsch');
        $de->method('getTitle')->willReturn('Deutsch');
        $de->method('getHreflang')->willReturn('de-DE');

        $en = $this->createMock(SiteLanguage::class);
        $en->method('getLanguageId')->willReturn(1);
        $en->method('getBase')->willReturn(new Uri('https://example.com/en/'));
        $en->method('getNavigationTitle')->willReturn('English');
        $en->method('getTitle')->willReturn('English');
        $en->method('getHreflang')->willReturn('en-US');

        return [$de, $en];
    }

    /**
     * @param list<SiteLanguage> $languages
     */
    private function multiLanguageSite(array $languages): Site
    {
        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getConfiguration')->willReturn(['websiteTitle' => 'Acme']);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree([]));
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getDefaultLanguage')->willReturn($languages[0]);
        $site->method('getLanguages')->willReturn($languages);

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

    private function middleware(
        FrontendInterface $cache,
        PageRepository $pageRepository,
        ?LlmsTxtNewsProvider $newsProvider = null
    ): LlmsTxtMiddleware {
        $pageRepositoryFactory = $this->createMock(LanguageAwarePageRepositoryFactory::class);
        $pageRepositoryFactory->method('create')->willReturn($pageRepository);

        return new LlmsTxtMiddleware(
            $pageRepository,
            $cache,
            $newsProvider ?? $this->emptyNewsProvider(),
            $pageRepositoryFactory
        );
    }

    private function emptyNewsProvider(): LlmsTxtNewsProvider
    {
        $provider = $this->createMock(LlmsTxtNewsProvider::class);
        $provider->method('recentNews')->willReturn([]);

        return $provider;
    }

    private function bodyOf(ResponseInterface $response): string
    {
        return (string)$response->getBody();
    }

    #[Test]
    public function escapesMarkdownMetacharactersInLinks(): void
    {
        $middleware = new LlmsTxtMiddleware(
            $this->createMock(PageRepository::class),
            $this->createMock(FrontendInterface::class),
            $this->emptyNewsProvider(),
            $this->createMock(LanguageAwarePageRepositoryFactory::class),
        );

        $markdownLink = (new \ReflectionMethod(LlmsTxtMiddleware::class, 'markdownLink'))
            ->invoke($middleware, 'Evil](http://evil.com', 'https://example.com/page');

        self::assertSame(
            '- [Evil\\](http://evil.com](https://example.com/page)',
            '- ' . $markdownLink
        );
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
    public function rendersDescriptionAsBlockquote(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $site = $this->site(['seo' => ['meta' => ['defaultDescription' => 'We build things.']]]);
        $response = $middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler());

        self::assertStringContainsString('> We build things.', $this->bodyOf($response));
    }

    #[Test]
    public function perLanguageAttributesOverrideGlobalSettings(): void
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('getLanguageId')->willReturn(1);
        $language->method('getBase')->willReturn(new Uri('https://example.com/en/'));
        $language->method('toArray')->willReturn([
            'websiteTitle' => 'Acme EN',
            'llmsTxtDescription' => 'English summary.',
            'llmsTxtIntro' => 'English intro paragraph.',
        ]);

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getConfiguration')->willReturn(['websiteTitle' => 'Acme']);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree([
            'seo' => [
                'meta' => ['defaultDescription' => 'German summary.'],
                'llmsTxt' => ['intro' => 'German intro.'],
            ],
        ]));
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getDefaultLanguage')->willReturn($language);
        $site->method('getLanguages')->willReturn([$language]);

        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $body = $this->bodyOf($middleware->process($this->request('/en/llms.txt', $site), $this->passthroughHandler()));

        self::assertStringContainsString('# Acme EN', $body);
        self::assertStringContainsString('> English summary.', $body);
        self::assertStringContainsString('English intro paragraph.', $body);
        self::assertStringNotContainsString('German', $body);
    }

    #[Test]
    public function rendersConfiguredIntroParagraph(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $site = $this->site(['seo' => ['llmsTxt' => ['intro' => 'This site documents accessible video players.']]]);
        $response = $middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler());

        self::assertStringContainsString('This site documents accessible video players.', $this->bodyOf($response));
    }

    #[Test]
    public function rendersAboutSectionFromSchemaSettings(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $site = $this->site(['seo' => ['schema' => [
            'organizationType' => 'Organization',
            'legalName' => 'Acme GmbH',
            'email' => 'hello@example.com',
            'knowsAbout' => 'TYPO3, Accessibility',
        ]]]);
        $response = $middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('## About', $body);
        self::assertStringContainsString('- Publisher: Acme GmbH (Organization)', $body);
        self::assertStringContainsString('- Email: hello@example.com', $body);
        self::assertStringContainsString('- Topics: TYPO3, Accessibility', $body);
    }

    #[Test]
    public function rendersPersonPublisherNameFromGivenAndFamilyName(): void
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('getLanguageId')->willReturn(0);
        $language->method('getBase')->willReturn(new Uri('https://example.com/'));

        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri('https://example.com/'));
        $site->method('getIdentifier')->willReturn('main');
        $site->method('getConfiguration')->willReturn([
            'websiteTitle' => 'mpcore',
            'schemaType' => 'Person',
            'schemaGivenName' => 'Matthias',
            'schemaFamilyName' => 'Peltzer',
        ]);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree([
            'seo' => ['schema' => ['knowsAbout' => 'TYPO3, PHP']],
        ]));
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getDefaultLanguage')->willReturn($language);
        $site->method('getLanguages')->willReturn([$language]);

        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);
        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $body = $this->bodyOf($middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler()));

        self::assertStringContainsString('- Publisher: Matthias Peltzer (Person)', $body);
        self::assertStringNotContainsString('Publisher: mpcore', $body);
    }

    #[Test]
    public function omitsAboutSectionWithoutSchemaData(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $response = $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());

        self::assertStringNotContainsString('## About', $this->bodyOf($response));
    }

    #[Test]
    public function rendersLatestNewsSectionFromProvider(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $newsProvider = $this->createMock(LlmsTxtNewsProvider::class);
        $newsProvider->method('recentNews')->willReturn([
            ['title' => 'Release 2.0', 'url' => 'https://example.com/news/release-2-0', 'teaser' => 'Big update.'],
            ['title' => 'Hiring', 'url' => 'https://example.com/news/hiring', 'teaser' => ''],
        ]);

        $middleware = $this->middleware($cache, $pageRepository, $newsProvider);
        $site = $this->site(['seo' => ['llmsTxt' => ['news' => ['storagePid' => '29', 'detailPageId' => 31]]]]);
        $response = $middleware->process($this->request('/llms.txt', $site), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('## Latest news', $body);
        self::assertStringContainsString('- [Release 2.0](https://example.com/news/release-2-0): Big update.', $body);
        self::assertStringContainsString('- [Hiring](https://example.com/news/hiring)', $body);
        self::assertStringNotContainsString('- [Hiring](https://example.com/news/hiring):', $body);
    }

    #[Test]
    public function omitsLatestNewsSectionWhenProviderEmpty(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $response = $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());

        self::assertStringNotContainsString('## Latest news', $this->bodyOf($response));
    }

    #[Test]
    public function servesEnglishVariantWithLanguagesSectionAndLocalizedSitemap(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $site = $this->multiLanguageSite($this->twoLanguages());
        $response = $middleware->process($this->request('/en/llms.txt', $site), $this->passthroughHandler());

        $body = $this->bodyOf($response);
        self::assertStringContainsString('## Languages', $body);
        self::assertStringContainsString('[Deutsch](https://example.com/llms.txt)', $body);
        self::assertStringContainsString('[English](https://example.com/en/llms.txt) (current)', $body);
        self::assertStringContainsString('- [XML Sitemap](https://example.com/en/sitemap.xml)', $body);
    }

    #[Test]
    public function usesLanguageAwareRepositoryForNonDefaultLanguage(): void
    {
        [$de, $en] = $this->twoLanguages();
        $site = $this->multiLanguageSite([$de, $en]);

        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $defaultRepository = $this->createMock(PageRepository::class);
        $defaultRepository->expects(self::never())->method('getMenu');

        $languageRepository = $this->createMock(PageRepository::class);
        $languageRepository->expects(self::atLeastOnce())->method('getMenu')->willReturn([]);

        $factory = $this->createMock(LanguageAwarePageRepositoryFactory::class);
        $factory->expects(self::once())->method('create')->with($en)->willReturn($languageRepository);

        $middleware = new LlmsTxtMiddleware($defaultRepository, $cache, $this->emptyNewsProvider(), $factory);
        $middleware->process($this->request('/en/llms.txt', $site), $this->passthroughHandler());
    }

    #[Test]
    public function usesInjectedRepositoryForDefaultLanguage(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $defaultRepository = $this->createMock(PageRepository::class);
        $defaultRepository->expects(self::atLeastOnce())->method('getMenu')->willReturn([]);

        $factory = $this->createMock(LanguageAwarePageRepositoryFactory::class);
        $factory->expects(self::never())->method('create');

        $middleware = new LlmsTxtMiddleware($defaultRepository, $cache, $this->emptyNewsProvider(), $factory);
        $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());
    }

    #[Test]
    public function passesThroughForUnknownLanguagePath(): void
    {
        $middleware = $this->middleware(
            $this->createMock(FrontendInterface::class),
            $this->createMock(PageRepository::class)
        );
        $site = $this->multiLanguageSite($this->twoLanguages());

        $response = $middleware->process($this->request('/fr/llms.txt', $site), $this->passthroughHandler());

        self::assertSame('passthrough', $this->bodyOf($response));
    }

    #[Test]
    public function singleLanguageOmitsLanguagesSection(): void
    {
        $cache = $this->createMock(FrontendInterface::class);
        $cache->method('get')->willReturn(false);

        $pageRepository = $this->createMock(PageRepository::class);
        $pageRepository->method('getMenu')->willReturn([]);

        $middleware = $this->middleware($cache, $pageRepository);
        $response = $middleware->process($this->request('/llms.txt', $this->site()), $this->passthroughHandler());

        self::assertStringNotContainsString('## Languages', $this->bodyOf($response));
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
