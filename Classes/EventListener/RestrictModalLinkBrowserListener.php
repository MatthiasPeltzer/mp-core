<?php

declare(strict_types=1);

namespace Mpc\MpCore\EventListener;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\View\Event\ModifyDatabaseQueryForRecordListingEvent;
use TYPO3\CMS\Core\Attribute\AsEventListener;

/**
 * Restricts the RTE / link browser "Modal" tab to ce_modal content elements only.
 *
 * The current request is read through {@see self::getRequest()}. TYPO3 does not
 * offer a way to constructor-inject a per-request object into a shared event
 * listener, and neither this event nor the DatabaseRecordList expose the request
 * publicly, so `$GLOBALS['TYPO3_REQUEST']` (the framework's sanctioned current
 * request accessor) is used behind an overridable seam that keeps the filtering
 * logic unit-testable.
 */
readonly class RestrictModalLinkBrowserListener
{
    private const string LINK_HANDLER_IDENTIFIER = 'tx_mpcore_modal';

    #[AsEventListener('mpc/mp-core/restrict-modal-link-browser')]
    public function __invoke(ModifyDatabaseQueryForRecordListingEvent $event): void
    {
        if ($event->getTable() !== 'tt_content') {
            return;
        }

        $request = $this->getRequest();
        if (!$request instanceof ServerRequestInterface) {
            return;
        }

        $parsedBody = $request->getParsedBody();
        $bodyAct = is_array($parsedBody) ? ($parsedBody['act'] ?? null) : null;
        $act = (string)($request->getQueryParams()['act'] ?? $bodyAct ?? '');
        if ($act !== self::LINK_HANDLER_IDENTIFIER) {
            return;
        }

        $queryBuilder = $event->getQueryBuilder();
        $queryBuilder->andWhere(
            $queryBuilder->expr()->eq(
                'CType',
                $queryBuilder->createNamedParameter('ce_modal')
            )
        );
    }

    protected function getRequest(): ?ServerRequestInterface
    {
        $request = $GLOBALS['TYPO3_REQUEST'] ?? null;

        return $request instanceof ServerRequestInterface ? $request : null;
    }
}
