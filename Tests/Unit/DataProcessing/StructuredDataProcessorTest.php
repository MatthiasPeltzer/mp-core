<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\DataProcessing;

use Mpc\MpCore\DataProcessing\StructuredDataProcessor;
use Mpc\MpCore\Enum\StructuredDataExtraEntityType;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Routing\PageArguments;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

#[CoversClass(StructuredDataProcessor::class)]
final class StructuredDataProcessorTest extends TestCase
{
    private StructuredDataProcessor $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new StructuredDataProcessor();
    }

    private function invoke(string $method, mixed ...$args): mixed
    {
        return (new \ReflectionMethod(StructuredDataProcessor::class, $method))->invokeArgs($this->subject, $args);
    }

    /**
     * @param array<string, mixed> $settingsTree
     * @param array<string, mixed> $configuration
     */
    private function site(array $settingsTree = [], array $configuration = []): Site
    {
        $site = $this->createMock(Site::class);
        $site->method('getSettings')->willReturn(SiteSettings::createFromSettingsTree($settingsTree));
        $site->method('getConfiguration')->willReturn($configuration);

        return $site;
    }

    #[Test]
    public function isStructuredDataEnabledRequiresBothToggles(): void
    {
        self::assertTrue($this->invoke('isStructuredDataEnabled', $this->site()));
        self::assertTrue($this->invoke('isStructuredDataEnabled', $this->site(['structuredDataEnabled' => true, 'seo' => ['schema' => ['enabled' => true]]])));
        self::assertFalse($this->invoke('isStructuredDataEnabled', $this->site(['structuredDataEnabled' => false])));
        self::assertFalse($this->invoke('isStructuredDataEnabled', $this->site(['seo' => ['schema' => ['enabled' => false]]])));
    }

    #[Test]
    public function resolvesExtraEntityTypeFromExplicitTypeOrMusicGroupFlag(): void
    {
        self::assertSame(
            StructuredDataExtraEntityType::LocalBusiness,
            $this->invoke('resolveExtraEntityType', $this->site(['structuredData' => ['extraEntity' => ['type' => 'LocalBusiness']]]))
        );
        self::assertSame(
            StructuredDataExtraEntityType::None,
            $this->invoke('resolveExtraEntityType', $this->site(['structuredData' => ['extraEntity' => ['type' => 'none']]]))
        );
        self::assertSame(
            StructuredDataExtraEntityType::MusicGroup,
            $this->invoke('resolveExtraEntityType', $this->site(['musicGroupEnabled' => true]))
        );
        self::assertSame(StructuredDataExtraEntityType::None, $this->invoke('resolveExtraEntityType', $this->site()));
    }

    #[Test]
    public function resolveSiteValueCascadesSettingsConfigLegacyDefault(): void
    {
        self::assertSame('fromSettings', $this->invoke('resolveSiteValue', $this->site(['key' => 'fromSettings']), 'key', null, ''));
        self::assertSame('fromConfig', $this->invoke('resolveSiteValue', $this->site([], ['key' => 'fromConfig']), 'key', null, ''));
        self::assertSame('fromLegacy', $this->invoke('resolveSiteValue', $this->site(['legacy' => 'fromLegacy']), 'key', 'legacy', ''));
        self::assertSame('theDefault', $this->invoke('resolveSiteValue', $this->site(), 'key', null, 'theDefault'));
    }

    #[Test]
    public function plainTextStripsMarkupAndCollapsesWhitespace(): void
    {
        self::assertSame('Line one Line two', $this->invoke('plainText', "<p>Line one<br>Line two</p>\n\n"));
        self::assertSame('', $this->invoke('plainText', ''));
    }

    #[Test]
    public function currentHreflangPrefersRequestLanguageThenDefault(): void
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('getHreflang')->willReturn('en-US');
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->willReturnMap([['language', null, $language]]);
        self::assertSame('en-US', $this->invoke('currentHreflang', $this->site(), $request));

        $defaultLanguage = $this->createMock(SiteLanguage::class);
        $defaultLanguage->method('getHreflang')->willReturn('de-DE');
        $site = $this->site();
        $site->method('getDefaultLanguage')->willReturn($defaultLanguage);
        $emptyRequest = $this->createMock(ServerRequestInterface::class);
        $emptyRequest->method('getAttribute')->willReturn(null);
        self::assertSame('de-DE', $this->invoke('currentHreflang', $site, $emptyRequest));
    }

    #[Test]
    public function newsDetailDetectionReadsRoutingArguments(): void
    {
        $pageArguments = $this->createMock(PageArguments::class);
        $pageArguments->method('getArguments')->willReturn(['tx_news_pi1' => ['news' => 42]]);
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->willReturnMap([['routing', null, $pageArguments]]);

        self::assertTrue($this->invoke('isNewsDetailRequest', $request));
        self::assertSame(42, $this->invoke('getNewsIdFromRequest', $request));
    }

    #[Test]
    public function newsDetailDetectionFalseWithoutRouting(): void
    {
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->willReturn(null);

        self::assertFalse($this->invoke('isNewsDetailRequest', $request));
    }

    #[Test]
    public function buildExtraEntityReturnsEmptyForNoneType(): void
    {
        $entity = $this->invoke(
            'buildExtraEntity',
            $this->createMock(ContentObjectRenderer::class),
            $this->site(),
            [],
            'https://example.com/',
            'Acme'
        );

        self::assertSame([], $entity);
    }

    #[Test]
    public function buildExtraEntityAddsGenreForMusicGroup(): void
    {
        $site = $this->site([
            'structuredData' => ['extraEntity' => [
                'type' => 'MusicGroup',
                'name' => 'The Band',
                'genre' => 'Rock',
            ]],
        ]);

        $entity = $this->invoke(
            'buildExtraEntity',
            $this->createMock(ContentObjectRenderer::class),
            $site,
            ['extraEntitySameAsUrls' => ['https://example.com/social']],
            'https://example.com/',
            'Acme'
        );

        self::assertSame('MusicGroup', $entity['@type']);
        self::assertSame('The Band', $entity['name']);
        self::assertSame('Rock', $entity['genre']);
        self::assertSame(['https://example.com/social'], $entity['sameAs']);
    }

    #[Test]
    public function buildExtraEntitySplitsKnowsAboutTopicsAndFallsBackToWebsiteTitle(): void
    {
        $site = $this->site([
            'structuredData' => ['extraEntity' => [
                'type' => 'LocalBusiness',
                'keywords' => 'coffee, roasting, wholesale',
            ]],
        ]);

        $entity = $this->invoke(
            'buildExtraEntity',
            $this->createMock(ContentObjectRenderer::class),
            $site,
            [],
            'https://example.com/',
            'Acme Coffee'
        );

        self::assertSame('LocalBusiness', $entity['@type']);
        // Name falls back to the website title when no explicit name is set.
        self::assertSame('Acme Coffee', $entity['name']);
        self::assertSame(['coffee', 'roasting', 'wholesale'], $entity['knowsAbout']);
    }
}
