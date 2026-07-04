<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\DataProcessing;

use Mpc\MpCore\DataProcessing\SocialMediaProcessor;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

#[CoversClass(SocialMediaProcessor::class)]
final class SocialMediaProcessorTest extends TestCase
{
    /**
     * @param array<string, mixed> $siteConfiguration
     * @return array<string, mixed>
     */
    private function process(array $siteConfiguration, bool $withSite = true): array
    {
        $processedData = [];
        if ($withSite) {
            $site = $this->createMock(Site::class);
            $site->method('getConfiguration')->willReturn($siteConfiguration);
            $processedData['site'] = $site;
        }

        return (new SocialMediaProcessor())->process(
            $this->createMock(ContentObjectRenderer::class),
            [],
            [],
            $processedData
        );
    }

    #[Test]
    public function extractsUrlFromLabelledConfigurationValue(): void
    {
        $result = $this->process([
            'facebook' => 'https://facebook.com/acme _blank - Facebook',
        ]);

        self::assertSame(['https://facebook.com/acme'], $result['socialMediaUrls']);
    }

    #[Test]
    public function rejectsInvalidUrls(): void
    {
        $result = $this->process([
            'facebook' => 'not-a-url',
            'x' => 'https://x.com/acme',
        ]);

        self::assertSame(['https://x.com/acme'], $result['socialMediaUrls']);
    }

    #[Test]
    public function excludesProfessionalProfilesFromExtraEntitySameAs(): void
    {
        $result = $this->process([
            'instagram' => 'https://instagram.com/acme',
            'github' => 'https://github.com/acme',
            'linkedin' => 'https://linkedin.com/in/acme',
        ]);

        // All valid URLs appear in the generic list.
        self::assertContains('https://github.com/acme', $result['socialMediaUrls']);
        self::assertContains('https://linkedin.com/in/acme', $result['socialMediaUrls']);
        self::assertContains('https://instagram.com/acme', $result['socialMediaUrls']);

        // Developer/professional profiles are excluded from the entity sameAs.
        self::assertSame(['https://instagram.com/acme'], $result['extraEntitySameAsUrls']);
        self::assertSame($result['extraEntitySameAsUrls'], $result['musicGroupSameAsUrls']);
    }

    #[Test]
    public function deduplicatesUrls(): void
    {
        $result = $this->process([
            'facebook' => 'https://same.example/acme',
            'instagram' => 'https://same.example/acme',
        ]);

        self::assertSame(['https://same.example/acme'], $result['socialMediaUrls']);
    }

    #[Test]
    public function returnsEmptyArraysWithoutSite(): void
    {
        $result = $this->process([], withSite: false);

        self::assertSame([], $result['socialMediaUrls']);
        self::assertSame([], $result['extraEntitySameAsUrls']);
        self::assertSame([], $result['musicGroupSameAsUrls']);
    }
}
