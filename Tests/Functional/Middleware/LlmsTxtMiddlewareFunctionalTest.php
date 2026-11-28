<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\Middleware;

use Mpc\MpCore\Tests\Functional\Support\FunctionalSiteTrait;
use Mpc\MpCore\Tests\Support\MpCoreTcaManifest;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\Framework\Frontend\InternalRequest;
use Mpc\MpCore\Tests\Support\MpCoreFunctionalTestCase;

final class LlmsTxtMiddlewareFunctionalTest extends MpCoreFunctionalTestCase
{
    use FunctionalSiteTrait;

    protected array $testExtensionsToLoad = MpCoreTcaManifest::FUNCTIONAL_TEST_EXTENSIONS;

    protected array $configurationToUseInTestInstance = [
        'SYS' => [
            'encryptionKey' => '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages_llms.csv');
        $this->setUpFrontendRootPage(1, []);
        $this->writeMinimalSiteConfiguration(settingsYaml: [
            'seo' => [
                'llmsTxt' => ['enabled' => true],
            ],
        ]);
    }

    #[Test]
    public function llmsTxtListsPublicPagesAndOmitsRestrictedOnes(): void
    {
        $response = $this->executeFrontendSubRequest(
            (new InternalRequest('http://localhost/llms.txt'))->withPageId(1),
        );

        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('text/markdown', (string)$response->getHeaderLine('Content-Type'));

        $body = (string)$response->getBody();
        self::assertStringContainsString('# Acme Site', $body);
        self::assertStringContainsString('Child', $body);
        self::assertStringNotContainsString('Members only', $body);
    }
}
