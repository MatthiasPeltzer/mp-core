<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Schema;

use Mpc\MpCore\Schema\PublisherSchemaBuilder;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Http\NormalizedParams;
use TYPO3\CMS\Core\Imaging\ImageResource;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Core\Http\ServerRequest;

#[CoversClass(PublisherSchemaBuilder::class)]
final class PublisherSchemaBuilderTest extends TestCase
{
    private PublisherSchemaBuilder $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new PublisherSchemaBuilder();
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

    /**
     * @param array<string, mixed> $settingsTree
     * @param array<string, mixed> $configuration
     * @return array<string, mixed>
     */
    private function build(array $settingsTree = [], array $configuration = []): array
    {
        return $this->subject->build(
            $this->createMock(ContentObjectRenderer::class),
            $this->site($settingsTree, $configuration),
            'https://example.com/',
            'https://example.com/#publisher',
            []
        );
    }

    #[Test]
    public function resolvesPublisherTypeFromSettingsThenConfigThenDefault(): void
    {
        self::assertSame('Organization', $this->subject->resolvePublisherType($this->site(['seo' => ['schema' => ['organizationType' => 'Organization']]])));
        self::assertSame('LocalBusiness', $this->subject->resolvePublisherType($this->site([], ['schemaType' => 'LocalBusiness'])));
        self::assertSame('Person', $this->subject->resolvePublisherType($this->site()));
    }

    #[Test]
    public function buildsOrganizationWithFullIdentityContactAndAddress(): void
    {
        $publisher = $this->build(
            [
                'seo' => ['schema' => [
                    'organizationType' => 'Organization',
                    'legalName' => 'Acme GmbH',
                    'alternateName' => 'Acme',
                    'description' => 'We build things.',
                    'foundingDate' => '2004-01-15',
                    'vatId' => 'DE123456789',
                    'taxId' => '12/345/67890',
                    'email' => 'info@example.com',
                    'telephone' => '+49 30 1234567',
                    'contactPoint' => [
                        'contactType' => 'customer service',
                        'telephone' => '+49 30 7654321',
                        'email' => 'support@example.com',
                        'areaServed' => 'DE',
                        'availableLanguage' => 'German, English',
                    ],
                    'address' => [
                        'streetAddress' => 'Main Street 1',
                        'addressLocality' => 'Berlin',
                        'postalCode' => '10115',
                        'addressRegion' => 'Berlin',
                        'addressCountry' => 'DE',
                    ],
                ]],
            ],
            ['websiteTitle' => 'Acme Site']
        );

        self::assertSame('Organization', $publisher['@type']);
        self::assertSame('https://example.com/#publisher', $publisher['@id']);
        self::assertSame('Acme Site', $publisher['name']);
        self::assertSame('https://example.com/', $publisher['url']);
        self::assertSame('Acme GmbH', $publisher['legalName']);
        self::assertSame('Acme', $publisher['alternateName']);
        self::assertSame('We build things.', $publisher['description']);
        self::assertSame('2004-01-15', $publisher['foundingDate']);
        self::assertSame('DE123456789', $publisher['vatID']);
        self::assertSame('12/345/67890', $publisher['taxID']);
        self::assertSame('info@example.com', $publisher['email']);
        self::assertSame('+49 30 1234567', $publisher['telephone']);

        self::assertSame([
            '@type' => 'PostalAddress',
            'streetAddress' => 'Main Street 1',
            'addressLocality' => 'Berlin',
            'postalCode' => '10115',
            'addressRegion' => 'Berlin',
            'addressCountry' => 'DE',
        ], $publisher['address']);

        self::assertSame([
            '@type' => 'ContactPoint',
            'contactType' => 'customer service',
            'telephone' => '+49 30 7654321',
            'email' => 'support@example.com',
            'areaServed' => 'DE',
            'availableLanguage' => ['German', 'English'],
        ], $publisher['contactPoint']);

        self::assertArrayNotHasKey('givenName', $publisher);
    }

    #[Test]
    public function personTypeKeepsNameFieldsAndOmitsOrganizationOnlyFields(): void
    {
        $publisher = $this->build(
            ['seo' => ['schema' => ['legalName' => 'Ignored GmbH', 'foundingDate' => '2000-01-01', 'vatId' => 'DE1', 'taxId' => 'T1']]],
            ['websiteTitle' => 'Jane Doe', 'schemaGivenName' => 'Jane', 'schemaFamilyName' => 'Doe']
        );

        self::assertSame('Person', $publisher['@type']);
        self::assertSame('Jane', $publisher['givenName']);
        self::assertSame('Doe', $publisher['familyName']);
        self::assertArrayNotHasKey('legalName', $publisher);
        self::assertArrayNotHasKey('foundingDate', $publisher);
        self::assertArrayNotHasKey('vatID', $publisher);
        self::assertArrayNotHasKey('taxID', $publisher);
    }

    #[Test]
    public function personTypeEmitsJobTitleAndKnowsAbout(): void
    {
        $publisher = $this->build(
            ['seo' => ['schema' => [
                'knowsAbout' => 'TYPO3, PHP, Accessibility',
                'person' => ['jobTitle' => 'Senior TYPO3 Developer'],
            ]]],
            ['websiteTitle' => 'Jane Doe', 'schemaGivenName' => 'Jane', 'schemaFamilyName' => 'Doe']
        );

        self::assertSame('Senior TYPO3 Developer', $publisher['jobTitle']);
        self::assertSame(['TYPO3', 'PHP', 'Accessibility'], $publisher['knowsAbout']);
    }

    #[Test]
    public function singleKnowsAboutTopicIsEmittedAsScalarAndOmittedWhenEmpty(): void
    {
        $single = $this->build(
            ['seo' => ['schema' => ['knowsAbout' => 'TYPO3']]],
            ['websiteTitle' => 'Jane Doe']
        );
        self::assertSame('TYPO3', $single['knowsAbout']);

        $none = $this->build([], ['websiteTitle' => 'Jane Doe']);
        self::assertArrayNotHasKey('jobTitle', $none);
        self::assertArrayNotHasKey('knowsAbout', $none);
    }

    #[Test]
    public function organizationEmitsKnowsAboutButNotPersonOnlyJobTitle(): void
    {
        $publisher = $this->build(
            ['seo' => ['schema' => [
                'organizationType' => 'Organization',
                'knowsAbout' => 'Consulting, Hosting',
                'person' => ['jobTitle' => 'CEO'],
            ]]],
            ['websiteTitle' => 'Acme Site']
        );

        self::assertSame('Organization', $publisher['@type']);
        self::assertSame(['Consulting', 'Hosting'], $publisher['knowsAbout']);
        self::assertArrayNotHasKey('jobTitle', $publisher);
    }

    #[Test]
    public function omitsEmptyAddressAndChannellessContactPoint(): void
    {
        // contactType has a default, but without a telephone/email the whole
        // ContactPoint is meaningless and must be dropped.
        $publisher = $this->build(
            ['seo' => ['schema' => ['organizationType' => 'Organization', 'contactPoint' => ['contactType' => 'customer service']]]],
            ['websiteTitle' => 'Acme Site']
        );

        self::assertArrayNotHasKey('address', $publisher);
        self::assertArrayNotHasKey('contactPoint', $publisher);
    }

    #[Test]
    public function singleAvailableLanguageIsEmittedAsScalar(): void
    {
        $publisher = $this->build(
            ['seo' => ['schema' => [
                'organizationType' => 'Organization',
                'contactPoint' => ['email' => 'support@example.com', 'availableLanguage' => 'German'],
            ]]],
            ['websiteTitle' => 'Acme Site']
        );

        self::assertSame('German', $publisher['contactPoint']['availableLanguage']);
    }

    #[Test]
    public function sameAsUrlsAreIncludedWhenProvided(): void
    {
        $publisher = $this->subject->build(
            $this->createMock(ContentObjectRenderer::class),
            $this->site([], ['websiteTitle' => 'Acme Site']),
            'https://example.com/',
            'https://example.com/#publisher',
            ['https://mastodon.social/@acme', 'https://example.com/profile']
        );

        self::assertSame(['https://mastodon.social/@acme', 'https://example.com/profile'], $publisher['sameAs']);
    }

    #[Test]
    public function buildImageObjectReturnsEmptyWhenReferenceIsEmpty(): void
    {
        $cObj = $this->createMock(ContentObjectRenderer::class);
        $cObj->expects(self::never())->method('getImgResource');

        self::assertSame([], $this->subject->buildImageObject($cObj, ''));
    }

    #[Test]
    public function buildImageObjectBuildsAbsoluteImageObjectFromImageResource(): void
    {
        $imageResource = new ImageResource(
            width: 1200,
            height: 630,
            extension: 'jpg',
            fullPath: '/var/www/html/fileadmin/logo.jpg',
            publicUrl: '/fileadmin/logo.jpg',
        );

        $normalizedParams = $this->createMock(NormalizedParams::class);
        $normalizedParams->method('getSiteUrl')->willReturn('https://example.com/');

        $request = (new ServerRequest('https://example.com/'))
            ->withAttribute('normalizedParams', $normalizedParams);

        $cObj = $this->createMock(ContentObjectRenderer::class);
        $cObj->expects(self::once())
            ->method('getImgResource')
            ->with('fileadmin/logo.jpg', ['treatIdAsReference' => 1])
            ->willReturn($imageResource);
        $cObj->method('getRequest')->willReturn($request);

        self::assertSame([
            '@type' => 'ImageObject',
            'url' => 'https://example.com/fileadmin/logo.jpg',
            'width' => 1200,
            'height' => 630,
        ], $this->subject->buildImageObject($cObj, 'fileadmin/logo.jpg'));
    }
}
