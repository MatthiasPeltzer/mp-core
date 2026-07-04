<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\LlmsTxtNewsProvider;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

#[CoversClass(LlmsTxtNewsProvider::class)]
final class LlmsTxtNewsProviderTest extends TestCase
{
    /**
     * The provider must short-circuit (without touching the database) when the
     * news storage/detail page is not configured, so the feature stays fully
     * opt-in and cheap on every uncached request.
     *
     * @param list<int> $storagePids
     */
    #[Test]
    #[\PHPUnit\Framework\Attributes\DataProvider('unconfiguredCases')]
    public function returnsEmptyWithoutDatabaseAccessWhenNotConfigured(
        array $storagePids,
        int $detailPageId,
        int $limit
    ): void {
        $connectionPool = $this->createMock(ConnectionPool::class);
        $connectionPool->expects(self::never())->method('getQueryBuilderForTable');
        $connectionPool->expects(self::never())->method('getConnectionForTable');

        $provider = new LlmsTxtNewsProvider($connectionPool);

        $result = $provider->recentNews(
            $this->createMock(Site::class),
            $this->createMock(SiteLanguage::class),
            $storagePids,
            $detailPageId,
            $limit
        );

        self::assertSame([], $result);
    }

    /**
     * @return iterable<string, array{0: list<int>, 1: int, 2: int}>
     */
    public static function unconfiguredCases(): iterable
    {
        yield 'no storage pid' => [[], 31, 5];
        yield 'zero-only storage pid' => [[0], 31, 5];
        yield 'no detail page' => [[29], 0, 5];
        yield 'zero limit' => [[29], 31, 0];
    }
}
