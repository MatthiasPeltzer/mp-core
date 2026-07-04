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

    private function writeStructuredDataSiteConfiguration(): void
    {
        $path = Environment::getConfigPath() . '/sites/mpcore';
        GeneralUtility::mkdir_deep($path);
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
            . "  structuredDataEnabled: true\n",
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
    public function rendersWebPageAndBreadcrumbForCurrentPage(): void
    {
        $graph = $this->renderGraphIndexedByType();

        self::assertArrayHasKey('WebPage', $graph);
        self::assertSame('Home', $graph['WebPage']['name']);
        self::assertSame('http://localhost/', $graph['WebPage']['url']);
        self::assertSame('Welcome to Acme', $graph['WebPage']['description']);

        self::assertArrayHasKey('BreadcrumbList', $graph);
        $items = $graph['BreadcrumbList']['itemListElement'];
        self::assertNotEmpty($items);
        self::assertSame('Home', $items[0]['name']);
        self::assertSame('http://localhost/', $items[0]['item']);
    }
}
