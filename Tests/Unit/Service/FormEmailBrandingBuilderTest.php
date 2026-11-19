<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\FormEmailBrandingBuilder;
use Mpc\MpCore\Service\SiteLogoResolver;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use GuzzleHttp\Psr7\Uri;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Routing\RouterInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;

#[CoversClass(FormEmailBrandingBuilder::class)]
final class FormEmailBrandingBuilderTest extends TestCase
{
    #[Test]
    public function buildFromRequestReturnsEmptyWithoutSite(): void
    {
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->with('site')->willReturn(null);

        $builder = new FormEmailBrandingBuilder(new SiteLogoResolver($this->createMock(ResourceFactory::class)));
        self::assertSame([], $builder->buildFromRequest($request));
    }

    #[Test]
    public function buildFromRequestMergesLogoColorsAndCustomFooter(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getPublicUrl')->willReturn('https://example.test/fileadmin/logo.png');
        $resourceFactory = $this->createMock(ResourceFactory::class);
        $resourceFactory->method('getFileObjectFromCombinedIdentifier')
            ->with('t3://file?uid=5')
            ->willReturn($file);
        $logoResolver = new SiteLogoResolver($resourceFactory);

        $settings = SiteSettings::createFromSettingsTree([
            'form.email.logo' => 't3://file?uid=5',
            'form.email.logoAlt' => 'mpcore',
            'form.email.footerText' => '<p>Custom footer</p>',
            'form.email.headerColor' => '',
            'form.email.footerColor' => '',
            'mpcConsent.imprintPage' => 0,
            'mpcConsent.privacyPolicyPage' => 0,
        ]);

        $site = $this->createMock(Site::class);
        $site->method('getRootPageId')->willReturn(1);
        $site->method('getBase')->willReturn(new Uri('https://example.test/'));
        $router = $this->createMock(RouterInterface::class);
        $router->method('generateUri')->willReturn(new Uri('https://example.test/'));
        $site->method('getRouter')->willReturn($router);
        $site->method('getConfiguration')->willReturn([
            'color-primary' => '#112233',
            'color-secondary' => '#445566',
            'color-tertiary' => '#778899',
            'websiteTitle' => 'Site title',
            'copyrightText' => 'mpcore',
        ]);
        $site->method('getSettings')->willReturn($settings);
        $site->method('getIdentifier')->willReturn('mpc');

        $language = $this->createMock(SiteLanguage::class);
        $language->method('toArray')->willReturn([
            'websiteTitle' => 'DE title',
        ]);
        $language->method('getLanguageId')->willReturn(0);

        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->willReturnMap([
            ['site', null, $site],
            ['language', null, $language],
        ]);

        $builder = new FormEmailBrandingBuilder($logoResolver);
        $brand = $builder->buildFromRequest($request);

        self::assertSame('https://example.test/fileadmin/logo.png', $brand['logoUrl']);
        self::assertSame('mpcore', $brand['logoAlt']);
        self::assertSame('https://example.test', $brand['homeUrl']);
        self::assertSame('#112233', $brand['headerBackgroundColor']);
        self::assertSame('#445566', $brand['footerBackgroundColor']);
        self::assertSame('<p>Custom footer</p>', $brand['footerText']);
    }
}
