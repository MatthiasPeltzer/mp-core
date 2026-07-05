<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Middleware;

use Mpc\MpCore\Middleware\GeoTextFileMiddlewareTrait;
use PHPUnit\Framework\Attributes\CoversTrait;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UriInterface;
use TYPO3\CMS\Core\Http\Uri;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;

#[CoversTrait(GeoTextFileMiddlewareTrait::class)]
final class GeoTextFileMiddlewareTraitTest extends TestCase
{
    private object $harness;

    protected function setUp(): void
    {
        parent::setUp();
        $this->harness = new class () {
            use GeoTextFileMiddlewareTrait;

            public function pubRelativePath(ServerRequestInterface $r, Site $s): string
            {
                return $this->resolveSiteRelativePath($r, $s);
            }

            public function pubMatches(ServerRequestInterface $r, Site $s, string $p): bool
            {
                return $this->matchesSitePath($r, $s, $p);
            }

            public function pubIdentifier(string $prefix, Site $s, SiteLanguage $l): string
            {
                return $this->geoTextCacheIdentifier($prefix, $s, $l);
            }

            /** @return list<string> */
            public function pubTags(Site $s): array
            {
                return $this->geoTextCacheTags($s);
            }

            public function pubBaseUrl(Site $s): string
            {
                return $this->resolveSiteBaseUrl($s);
            }

            public function pubLanguage(ServerRequestInterface $r, Site $s): SiteLanguage
            {
                return $this->resolveSiteLanguage($r, $s);
            }

            public function pubTruthy(Site $s, string $key, bool $default = true): bool
            {
                return $this->isTruthySiteSetting($s, $key, $default);
            }
        };
    }

    private function requestWithPath(string $path, ?SiteLanguage $language = null): ServerRequestInterface
    {
        $uri = $this->createMock(UriInterface::class);
        $uri->method('getPath')->willReturn($path);
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getUri')->willReturn($uri);
        $request->method('getAttribute')->willReturnMap([['language', null, $language]]);

        return $request;
    }

    /**
     * @param array<string, mixed> $settingsTree
     */
    private function site(string $base, string $identifier = 'main', array $settingsTree = []): Site
    {
        $site = $this->createMock(Site::class);
        $site->method('getBase')->willReturn(new Uri($base));
        $site->method('getIdentifier')->willReturn($identifier);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree($settingsTree));

        return $site;
    }

    #[Test]
    public function resolvesRelativePathForRootBase(): void
    {
        self::assertSame('robots.txt', $this->harness->pubRelativePath($this->requestWithPath('/robots.txt'), $this->site('https://example.com/')));
    }

    #[Test]
    public function stripsSubdirectoryBasePath(): void
    {
        self::assertSame('robots.txt', $this->harness->pubRelativePath($this->requestWithPath('/sub/robots.txt'), $this->site('https://example.com/sub/')));
    }

    #[Test]
    public function returnsEmptyStringWhenPathEqualsBasePath(): void
    {
        self::assertSame('', $this->harness->pubRelativePath($this->requestWithPath('/sub'), $this->site('https://example.com/sub/')));
    }

    #[Test]
    public function matchesSitePathIgnoringSlashes(): void
    {
        $site = $this->site('https://example.com/');
        self::assertTrue($this->harness->pubMatches($this->requestWithPath('/robots.txt'), $site, 'robots.txt'));
        self::assertFalse($this->harness->pubMatches($this->requestWithPath('/sitemap.xml'), $site, 'robots.txt'));
    }

    #[Test]
    public function cacheIdentifierIsDeterministicAndLanguageScoped(): void
    {
        $site = $this->site('https://example.com/');
        $lang0 = $this->createMock(SiteLanguage::class);
        $lang0->method('getLanguageId')->willReturn(0);
        $lang1 = $this->createMock(SiteLanguage::class);
        $lang1->method('getLanguageId')->willReturn(1);

        $id0 = $this->harness->pubIdentifier('robots', $site, $lang0);

        self::assertStringStartsWith('robots_', $id0);
        self::assertSame($id0, $this->harness->pubIdentifier('robots', $site, $lang0));
        self::assertNotSame($id0, $this->harness->pubIdentifier('robots', $site, $lang1));
    }

    #[Test]
    public function cacheTagsSanitizeSiteIdentifier(): void
    {
        $tags = $this->harness->pubTags($this->site('https://example.com/', 'main site!'));

        self::assertContains('mp_core_geotext', $tags);
        self::assertContains('site_main_site_', $tags);
    }

    #[Test]
    public function resolvesBaseUrlWithoutTrailingSlash(): void
    {
        self::assertSame('https://example.com', $this->harness->pubBaseUrl($this->site('https://example.com/')));
    }

    #[Test]
    public function resolvesLanguageFromRequestOtherwiseDefault(): void
    {
        $requestLanguage = $this->createMock(SiteLanguage::class);
        $defaultLanguage = $this->createMock(SiteLanguage::class);
        $site = $this->site('https://example.com/');
        $site->method('getDefaultLanguage')->willReturn($defaultLanguage);

        self::assertSame($requestLanguage, $this->harness->pubLanguage($this->requestWithPath('/', $requestLanguage), $site));
        self::assertSame($defaultLanguage, $this->harness->pubLanguage($this->requestWithPath('/'), $site));
    }

    #[Test]
    public function truthySettingRespectsValueAndDefault(): void
    {
        self::assertFalse($this->harness->pubTruthy($this->site('https://example.com/', 'main', ['seo' => ['robots' => ['enabled' => false]]]), 'seo.robots.enabled'));
        self::assertTrue($this->harness->pubTruthy($this->site('https://example.com/', 'main', ['seo' => ['robots' => ['enabled' => true]]]), 'seo.robots.enabled'));
        // Missing key falls back to the provided default.
        self::assertTrue($this->harness->pubTruthy($this->site('https://example.com/'), 'seo.robots.enabled', true));
        self::assertFalse($this->harness->pubTruthy($this->site('https://example.com/'), 'seo.robots.enabled', false));
    }
}
