<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\DataProcessing;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\Framework\Frontend\InternalRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

/**
 * Functional test for {@see \Mpc\MpCore\DataProcessing\StructuredDataProcessor}.
 *
 * Renders a real frontend page whose TypoScript runs the processor and outputs
 * the resulting JSON-LD verbatim. This exercises the full graph assembly with
 * real site routing (typolink), page information and rootline — the parts that
 * unit tests cannot cover.
 */
final class StructuredDataProcessorTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['rte_ckeditor', 'seo'];

    protected array $testExtensionsToLoad = [
        'b13/container',
        'friendsoftypo3/content-blocks',
        'mpc/mp-core',
    ];

    protected array $configurationToUseInTestInstance = [
        'SYS' => [
            'encryptionKey' => '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $this->setUpFrontendRootPage(1, ['EXT:mp_core/Tests/Functional/Fixtures/TypoScript/StructuredData.typoscript']);
        $this->writeStructuredDataSiteConfiguration();
    }

    private function writeStructuredDataSiteConfiguration(bool $schemaEnabled = true): void
    {
        $path = Environment::getConfigPath() . '/sites/mpcore';
        GeneralUtility::mkdir_deep($path);
        $enabled = $schemaEnabled ? 'true' : 'false';
        GeneralUtility::writeFile(
            $path . '/config.yaml',
            "rootPageId: 1\n"
            . "base: 'http://localhost/'\n"
            . "websiteTitle: 'Acme Site'\n"
            . "schemaType: 'Organization'\n"
            . "languages:\n"
            . "  - languageId: 0\n"
            . "    title: English\n"
            . "    base: /\n"
            . "    locale: en_US.UTF-8\n"
            . "settings:\n"
            . "  structuredDataEnabled: true\n"
            . "  seo:\n"
            . "    schema:\n"
            . "      enabled: {$enabled}\n"
            . "      organizationType: 'Organization'\n"
            . "      legalName: 'Acme GmbH'\n"
            . "      email: 'info@example.com'\n"
            . "      telephone: '+49 30 1234567'\n"
            . "      address:\n"
            . "        streetAddress: 'Main Street 1'\n"
            . "        addressLocality: 'Berlin'\n"
            . "        postalCode: '10115'\n"
            . "        addressCountry: 'DE'\n"
            . "      contactPoint:\n"
            . "        contactType: 'customer service'\n"
            . "        email: 'support@example.com'\n",
        );
    }

    /**
     * @return array<string, array<string, mixed>> graph entries indexed by @type
     */
    private function renderGraphIndexedByType(): array
    {
        $response = $this->executeFrontendSubRequest((new InternalRequest('http://localhost/'))->withPageId(1));
        $body = (string)$response->getBody();

        // The PAGE is rendered as a full HTML document (seo adds the head); the
        // JSON-LD produced by the processor is the sole <body> content.
        self::assertSame(1, preg_match('~<body>(.*)</body>~s', $body, $matches));
        $payload = json_decode(trim($matches[1]), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('https://schema.org', $payload['@context']);
        self::assertArrayHasKey('@graph', $payload);

        $byType = [];
        foreach ($payload['@graph'] as $entity) {
            $byType[$entity['@type']] = $entity;
        }

        return $byType;
    }

    #[Test]
    public function rendersPublisherAndWebSiteGraph(): void
    {
        $graph = $this->renderGraphIndexedByType();

        self::assertArrayHasKey('Organization', $graph);
        self::assertSame('Acme Site', $graph['Organization']['name']);
        self::assertSame('http://localhost/#publisher', $graph['Organization']['@id']);

        self::assertArrayHasKey('WebSite', $graph);
        self::assertSame('Acme Site', $graph['WebSite']['name']);
        self::assertSame('http://localhost/', $graph['WebSite']['url']);
        self::assertSame(['@id' => 'http://localhost/#publisher'], $graph['WebSite']['publisher']);
    }

    #[Test]
    public function rendersOrganizationIdentityContactAndAddress(): void
    {
        $graph = $this->renderGraphIndexedByType();

        $organization = $graph['Organization'];
        self::assertSame('Acme GmbH', $organization['legalName']);
        self::assertSame('info@example.com', $organization['email']);
        self::assertSame('+49 30 1234567', $organization['telephone']);

        self::assertSame([
            '@type' => 'PostalAddress',
            'streetAddress' => 'Main Street 1',
            'addressLocality' => 'Berlin',
            'postalCode' => '10115',
            'addressCountry' => 'DE',
        ], $organization['address']);

        self::assertSame([
            '@type' => 'ContactPoint',
            'contactType' => 'customer service',
            'email' => 'support@example.com',
        ], $organization['contactPoint']);
    }

    #[Test]
    public function rendersWebPageAndBreadcrumbForCurrentPage(): void
    {
        $graph = $this->renderGraphIndexedByType();

        self::assertArrayHasKey('WebPage', $graph);
        self::assertSame('Home', $graph['WebPage']['name']);
        self::assertSame('http://localhost/', $graph['WebPage']['url']);
        self::assertSame('Welcome to Acme', $graph['WebPage']['description']);

        // The WebPage references the BreadcrumbList by its stable @id.
        self::assertArrayHasKey('BreadcrumbList', $graph);
        self::assertSame($graph['BreadcrumbList']['@id'], $graph['WebPage']['breadcrumb']['@id']);

        $items = $graph['BreadcrumbList']['itemListElement'];
        self::assertNotEmpty($items);
        self::assertSame('Home', $items[0]['name']);
        self::assertSame('http://localhost/', $items[0]['item']);
    }

    #[Test]
    public function omitsJsonLdWhenSchemaDisabled(): void
    {
        $this->writeStructuredDataSiteConfiguration(false);

        $response = $this->executeFrontendSubRequest((new InternalRequest('http://localhost/'))->withPageId(1));
        $body = (string)$response->getBody();

        self::assertSame(1, preg_match('~<body>(.*)</body>~s', $body, $matches));
        self::assertSame('', trim($matches[1]));
    }
}
