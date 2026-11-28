<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Search;

use Mpc\MpCore\Search\SearchSuggestService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(SearchSuggestService::class)]
final class SearchSuggestServiceTest extends TestCase
{
    #[Test]
    public function decodeStaticPageArgumentsReturnsEmptyArrayForInvalidJson(): void
    {
        $method = new \ReflectionMethod(SearchSuggestService::class, 'decodeStaticPageArguments');

        self::assertSame([], $method->invoke(null, null));
        self::assertSame([], $method->invoke(null, ''));
        self::assertSame([], $method->invoke(null, '{invalid'));
    }

    #[Test]
    public function suggestRejectsTermsLongerThanMaxLength(): void
    {
        $service = new SearchSuggestService(
            $this->createMock(\TYPO3\CMS\Core\Database\ConnectionPool::class),
            $this->createMock(\TYPO3\CMS\Core\Context\Context::class),
        );

        $tooLong = str_repeat('a', SearchSuggestService::MAX_TERM_LENGTH + 1);
        self::assertSame(['words' => [], 'pages' => []], $service->suggest($tooLong, 1, 0));
    }

    #[Test]
    public function decodeStaticPageArgumentsReturnsDecodedArray(): void
    {
        $method = new \ReflectionMethod(SearchSuggestService::class, 'decodeStaticPageArguments');

        self::assertSame(
            ['media' => '27'],
            $method->invoke(null, '{"media":"27"}')
        );
    }
}
