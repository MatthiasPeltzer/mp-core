<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Seo;

use Mpc\MpCore\Seo\SitemapViewMetadataResolver;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

#[CoversClass(SitemapViewMetadataResolver::class)]
final class SitemapViewMetadataResolverTest extends TestCase
{
    private SitemapViewMetadataResolver $resolver;

    protected function setUp(): void
    {
        parent::setUp();
        $this->resolver = new SitemapViewMetadataResolver();
    }

    #[Test]
    public function resolveWebsiteTitlePrefersLanguageWebsiteTitle(): void
    {
        $site = $this->createMock(Site::class);
        $site->method('getConfiguration')->willReturn(['websiteTitle' => 'Site fallback']);

        $language = $this->createMock(SiteLanguage::class);
        $language->method('getWebsiteTitle')->willReturn('Localized title');
        $language->method('getTitle')->willReturn('English');

        self::assertSame('Localized title', $this->resolver->resolveWebsiteTitle($site, $language));
    }

    #[Test]
    public function resolveWebsiteTitleFallsBackToSiteConfiguration(): void
    {
        $site = $this->createMock(Site::class);
        $site->method('getConfiguration')->willReturn(['websiteTitle' => 'mpcore']);

        $language = $this->createMock(SiteLanguage::class);
        $language->method('getWebsiteTitle')->willReturn('');
        $language->method('getTitle')->willReturn('Deutsch');

        self::assertSame('mpcore', $this->resolver->resolveWebsiteTitle($site, $language));
    }

    #[Test]
    public function formatMetaCommentSanitizesSeparatorsAndDoubleHyphens(): void
    {
        $comment = $this->resolver->formatMetaComment('mpcore -- demo', 'EN :: GB');

        self::assertSame('mpcSitemapMeta mpcore - demo :: EN / GB', $comment);
    }
}
