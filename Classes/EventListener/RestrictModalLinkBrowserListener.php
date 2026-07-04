<?php

declare(strict_types=1);

namespace Mpc\MpCore\EventListener;

use TYPO3\CMS\Backend\View\Event\ModifyDatabaseQueryForRecordListingEvent;
use TYPO3\CMS\Core\Attribute\AsEventListener;

/**
 * Restricts the RTE / link browser "Modal" tab to ce_modal content elements only.
 */
final readonly class RestrictModalLinkBrowserListener
{
    private const string LINK_HANDLER_IDENTIFIER = 'tx_mpcore_modal';

    #[AsEventListener('mpc/mp-core/restrict-modal-link-browser')]
    public function __invoke(ModifyDatabaseQueryForRecordListingEvent $event): void
    {
        if ($event->getTable() !== 'tt_content') {
            return;
        }

        $request = $GLOBALS['TYPO3_REQUEST'] ?? null;
        if ($request === null) {
            return;
        }

        $act = (string)($request->getQueryParams()['act'] ?? $request->getParsedBody()['act'] ?? '');
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
}
