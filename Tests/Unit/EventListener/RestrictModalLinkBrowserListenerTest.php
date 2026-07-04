<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\EventListener;

use Mpc\MpCore\EventListener\RestrictModalLinkBrowserListener;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\RecordList\DatabaseRecordList;
use TYPO3\CMS\Backend\View\Event\ModifyDatabaseQueryForRecordListingEvent;
use TYPO3\CMS\Core\Database\Query\Expression\ExpressionBuilder;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;

#[CoversClass(RestrictModalLinkBrowserListener::class)]
final class RestrictModalLinkBrowserListenerTest extends TestCase
{
    #[Test]
    public function ignoresTablesOtherThanTtContent(): void
    {
        $queryBuilder = $this->createMock(QueryBuilder::class);
        $queryBuilder->expects(self::never())->method('andWhere');

        $event = $this->createEvent($queryBuilder, 'pages');
        $this->createListener($this->requestWithAct('tx_mpcore_modal'))($event);
    }

    #[Test]
    public function ignoresWhenRequestIsMissing(): void
    {
        $queryBuilder = $this->createMock(QueryBuilder::class);
        $queryBuilder->expects(self::never())->method('andWhere');

        $event = $this->createEvent($queryBuilder, 'tt_content');
        $this->createListener(null)($event);
    }

    #[Test]
    public function ignoresWhenActParameterDoesNotMatch(): void
    {
        $queryBuilder = $this->createMock(QueryBuilder::class);
        $queryBuilder->expects(self::never())->method('andWhere');

        $event = $this->createEvent($queryBuilder, 'tt_content');
        $this->createListener($this->requestWithAct('page'))($event);
    }

    #[Test]
    public function restrictsToModalContentElementsForMatchingAct(): void
    {
        $expressionBuilder = $this->createMock(ExpressionBuilder::class);
        $expressionBuilder->expects(self::once())
            ->method('eq')
            ->with('CType', ':param')
            ->willReturn('CType = :param');

        $queryBuilder = $this->createMock(QueryBuilder::class);
        $queryBuilder->method('expr')->willReturn($expressionBuilder);
        $queryBuilder->expects(self::once())
            ->method('createNamedParameter')
            ->with('ce_modal')
            ->willReturn(':param');
        $queryBuilder->expects(self::once())
            ->method('andWhere')
            ->with('CType = :param');

        $event = $this->createEvent($queryBuilder, 'tt_content');
        $this->createListener($this->requestWithAct('tx_mpcore_modal'))($event);
    }

    #[Test]
    public function readsActParameterFromParsedBody(): void
    {
        $expressionBuilder = $this->createMock(ExpressionBuilder::class);
        $expressionBuilder->method('eq')->willReturn('CType = :param');

        $queryBuilder = $this->createMock(QueryBuilder::class);
        $queryBuilder->method('expr')->willReturn($expressionBuilder);
        $queryBuilder->method('createNamedParameter')->willReturn(':param');
        $queryBuilder->expects(self::once())->method('andWhere');

        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getQueryParams')->willReturn([]);
        $request->method('getParsedBody')->willReturn(['act' => 'tx_mpcore_modal']);

        $event = $this->createEvent($queryBuilder, 'tt_content');
        $this->createListener($request)($event);
    }

    private function createListener(?ServerRequestInterface $request): RestrictModalLinkBrowserListener
    {
        return new readonly class($request) extends RestrictModalLinkBrowserListener {
            public function __construct(private ?ServerRequestInterface $stubRequest) {}

            protected function getRequest(): ?ServerRequestInterface
            {
                return $this->stubRequest;
            }
        };
    }

    private function requestWithAct(string $act): ServerRequestInterface
    {
        $request = $this->createMock(ServerRequestInterface::class);
        $request->method('getQueryParams')->willReturn(['act' => $act]);
        $request->method('getParsedBody')->willReturn(null);

        return $request;
    }

    private function createEvent(QueryBuilder $queryBuilder, string $table): ModifyDatabaseQueryForRecordListingEvent
    {
        return new ModifyDatabaseQueryForRecordListingEvent(
            $queryBuilder,
            $table,
            1,
            [],
            0,
            100,
            $this->createMock(DatabaseRecordList::class),
        );
    }
}
