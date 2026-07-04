<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\DataProcessing;

use Mpc\MpCore\DataProcessing\HeaderLogoProcessor;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

#[CoversClass(HeaderLogoProcessor::class)]
final class HeaderLogoProcessorTest extends TestCase
{
    /**
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     * @param list<array{0: string, 1: string}> $cascade
     * @return array{0: string, 1: ?string}
     */
    private function resolveString(array $languageConfig, array $siteConfig, array $cascade): array
    {
        return (new \ReflectionMethod(HeaderLogoProcessor::class, 'resolveString'))
            ->invoke(new HeaderLogoProcessor(), $languageConfig, $siteConfig, $cascade);
    }

    #[Test]
    public function resolveStringPrefersLanguageScope(): void
    {
        [$value, $scope] = $this->resolveString(
            ['logoBig' => 't3://file?uid=1'],
            ['logoBig' => 't3://file?uid=2'],
            [['language', 'logoBig'], ['site', 'logoBig']]
        );

        self::assertSame('t3://file?uid=1', $value);
        self::assertSame('language', $scope);
    }

    #[Test]
    public function resolveStringFallsThroughToSite(): void
    {
        [$value, $scope] = $this->resolveString(
            [],
            ['logoBig' => 't3://file?uid=2'],
            [['language', 'logoBig'], ['site', 'logoBig']]
        );

        self::assertSame('t3://file?uid=2', $value);
        self::assertSame('site', $scope);
    }

    #[Test]
    public function resolveStringReturnsNullScopeWhenEmpty(): void
    {
        [$value, $scope] = $this->resolveString([], [], [['language', 'logoBig'], ['site', 'logoBig']]);

        self::assertSame('', $value);
        self::assertNull($scope);
    }

    /**
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     */
    private function boolFromScope(array $languageConfig, array $siteConfig, ?string $scope, string $key, bool $default): bool
    {
        return (new \ReflectionMethod(HeaderLogoProcessor::class, 'boolFromScope'))
            ->invoke(new HeaderLogoProcessor(), $languageConfig, $siteConfig, $scope, $key, $default);
    }

    #[Test]
    public function boolFromScopeUsesDefaultForNullScopeOrMissingKey(): void
    {
        self::assertTrue($this->boolFromScope([], [], null, 'logoSvg', true));
        self::assertFalse($this->boolFromScope([], [], null, 'logoSvg', false));
        self::assertTrue($this->boolFromScope(['other' => 1], [], 'language', 'logoSvg', true));
    }

    #[Test]
    public function boolFromScopeReadsToggleFromNamedScope(): void
    {
        self::assertTrue($this->boolFromScope(['logoSvg' => '1'], [], 'language', 'logoSvg', false));
        self::assertFalse($this->boolFromScope([], ['logoSvg' => '0'], 'site', 'logoSvg', true));
    }

    #[Test]
    public function processResolvesLogosWithScopeCoupledToggles(): void
    {
        $language = $this->createMock(SiteLanguage::class);
        $language->method('toArray')->willReturn([
            'logoBig' => 't3://file?uid=10',
            'logoSvg' => '0',
            'websiteTitle' => 'Acme DE',
        ]);

        $site = $this->createMock(Site::class);
        $site->method('getConfiguration')->willReturn([
            'logoBig' => 't3://file?uid=20',
            'logoSvg' => '1',
            'logoText' => 'Acme',
            'logoTextHidden' => '1',
        ]);

        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getAttribute')->willReturnMap([
            ['site', null, $site],
            ['language', null, $language],
        ]);
        $cObj = $this->createMock(ContentObjectRenderer::class);
        $cObj->method('getRequest')->willReturn($request);

        $result = (new HeaderLogoProcessor())->process($cObj, [], [], []);

        // Big logo comes from language scope; its logoSvg toggle follows that scope.
        self::assertSame('t3://file?uid=10', $result['logoBig']);
        self::assertFalse($result['logoSvgBig']);
        // Small logo falls back to the big logo (language scope again).
        self::assertSame('t3://file?uid=10', $result['logoSmall']);
        self::assertFalse($result['logoSvgSmall']);
        // Text comes from site scope; hidden toggle follows the site scope.
        self::assertSame('Acme', $result['logoText']);
        self::assertTrue($result['logoTextHidden']);
        // websiteTitle has no site fallback.
        self::assertSame('Acme DE', $result['websiteTitle']);
    }
}
