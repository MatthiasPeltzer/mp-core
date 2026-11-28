<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\Middleware;

use Mpc\MpCore\Tests\Functional\Support\FunctionalSiteTrait;
use Mpc\MpCore\Tests\Support\MpCoreTcaManifest;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\Framework\Frontend\InternalRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class SearchSuggestMiddlewareFunctionalTest extends FunctionalTestCase
{
    use FunctionalSiteTrait;

    /** @var list<string> */
    protected array $coreExtensionsToLoad = [
        ...MpCoreTcaManifest::CORE_EXTENSIONS_TO_LOAD,
        'indexed_search',
    ];

    protected array $testExtensionsToLoad = MpCoreTcaManifest::FUNCTIONAL_TEST_EXTENSIONS;

    protected array $configurationToUseInTestInstance = [
        'SYS' => [
            'encryptionKey' => '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $this->setUpFrontendRootPage(1, []);
        $this->writeMinimalSiteConfiguration();
    }

    #[Test]
    public function suggestEndpointReturnsJsonForValidQuery(): void
    {
        $response = $this->executeFrontendSubRequest(
            (new InternalRequest('http://localhost/?tx_mpcore_suggest=1&q=ch'))->withPageId(1),
        );

        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('application/json', (string)$response->getHeaderLine('Content-Type'));

        $payload = json_decode((string)$response->getBody(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('ch', $payload['query']);
        self::assertArrayHasKey('suggestions', $payload);
        self::assertIsArray($payload['suggestions']);
    }

    #[Test]
    public function suggestRejectsTooShortQuery(): void
    {
        $response = $this->executeFrontendSubRequest(
            (new InternalRequest('http://localhost/?tx_mpcore_suggest=1&q=a'))->withPageId(1),
        );

        self::assertSame(200, $response->getStatusCode());
        $payload = json_decode((string)$response->getBody(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame([], $payload['suggestions']);
    }
}
