<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Search;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;

/**
 * Provides autosuggest data for the EXT:indexed_search frontend, sourced directly
 * from the indexer tables (no Solr required).
 *
 * Two kinds of suggestions are produced:
 *   - "words": distinct indexed base words matching the typed prefix, ranked by
 *     how often they occur (index_words + index_rel).
 *   - "pages": indexed TYPO3 pages whose title contains the term (index_phash),
 *     access-filtered against the current frontend user group list the same way
 *     IndexSearchRepository::checkResume() does, so restricted titles never leak.
 *
 * All queries are scoped to the current site (rootline level 0) and language.
 */
final class SearchSuggestService
{
    private const MIN_TERM_LENGTH = 2;
    private const MAX_WORDS = 6;
    private const MAX_PAGES = 5;

    public function __construct(
        private readonly ConnectionPool $connectionPool,
        private readonly Context $context,
    ) {}

    /**
     * @return array{words: list<string>, pages: list<array{title: string, pageId: int}>}
     */
    public function suggest(string $term, int $rootPageId, int $languageId): array
    {
        $term = trim($term);
        if (mb_strlen($term) < self::MIN_TERM_LENGTH || $rootPageId <= 0) {
            return ['words' => [], 'pages' => []];
        }

        return [
            'words' => $this->findWords($term, $rootPageId),
            'pages' => $this->findPages($term, $rootPageId, $languageId),
        ];
    }

    /**
     * Distinct base words starting with the typed term, most frequent first.
     *
     * @return list<string>
     */
    private function findWords(string $term, int $rootPageId): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable('index_words');
        // Index tables carry no TCA / enable columns, so restriction containers
        // would reference non-existent fields.
        $queryBuilder->getRestrictions()->removeAll();

        $prefix = $queryBuilder->escapeLikeWildcards(mb_strtolower($term)) . '%';

        $rows = $queryBuilder
            ->select('IW.baseword')
            ->addSelectLiteral($queryBuilder->expr()->sum('IR.count', 'occurrences'))
            ->from('index_words', 'IW')
            ->innerJoin('IW', 'index_rel', 'IR', $queryBuilder->expr()->eq('IW.wid', $queryBuilder->quoteIdentifier('IR.wid')))
            ->innerJoin('IR', 'index_section', 'ISEC', $queryBuilder->expr()->eq('ISEC.phash', $queryBuilder->quoteIdentifier('IR.phash')))
            ->where(
                $queryBuilder->expr()->eq('IW.is_stopword', $queryBuilder->createNamedParameter(0, Connection::PARAM_INT)),
                $queryBuilder->expr()->like('IW.baseword', $queryBuilder->createNamedParameter($prefix)),
                $queryBuilder->expr()->eq('ISEC.rl0', $queryBuilder->createNamedParameter($rootPageId, Connection::PARAM_INT)),
            )
            ->groupBy('IW.baseword')
            ->orderBy('occurrences', 'DESC')
            ->addOrderBy('IW.baseword', 'ASC')
            ->setMaxResults(self::MAX_WORDS)
            ->executeQuery()
            ->fetchAllAssociative();

        return array_values(array_map(static fn (array $row): string => (string)$row['baseword'], $rows));
    }

    /**
     * Indexed pages whose title matches the term, access-filtered for the current user.
     *
     * @return list<array{title: string, pageId: int}>
     */
    private function findPages(string $term, int $rootPageId, int $languageId): array
    {
        $userGroupList = implode(
            ',',
            $this->context->getPropertyFromAspect('frontend.user', 'groupIds', [0, -1])
        );

        $queryBuilder = $this->connectionPool->getQueryBuilderForTable('index_phash');
        $queryBuilder->getRestrictions()->removeAll();

        $needle = '%' . $queryBuilder->escapeLikeWildcards($term) . '%';
        // Reused in both the access join and the WHERE, so the value is bound once.
        $groupListParameter = $queryBuilder->createNamedParameter($userGroupList);

        $rows = $queryBuilder
            ->select('IP.item_title', 'IP.data_page_id')
            ->from('index_phash', 'IP')
            ->innerJoin('IP', 'index_section', 'ISEC', $queryBuilder->expr()->eq('ISEC.phash', $queryBuilder->quoteIdentifier('IP.phash')))
            ->leftJoin(
                'IP',
                'index_grlist',
                'IGL',
                (string)$queryBuilder->expr()->and(
                    $queryBuilder->expr()->eq('IGL.phash', $queryBuilder->quoteIdentifier('IP.phash')),
                    $queryBuilder->expr()->eq('IGL.gr_list', $groupListParameter),
                )
            )
            ->where(
                // item_type '0' == regular TYPO3 pages (not external media / files).
                $queryBuilder->expr()->eq('IP.item_type', $queryBuilder->createNamedParameter('0')),
                $queryBuilder->expr()->eq('IP.sys_language_uid', $queryBuilder->createNamedParameter($languageId, Connection::PARAM_INT)),
                $queryBuilder->expr()->eq('ISEC.rl0', $queryBuilder->createNamedParameter($rootPageId, Connection::PARAM_INT)),
                $queryBuilder->expr()->like('IP.item_title', $queryBuilder->createNamedParameter($needle)),
                $queryBuilder->expr()->neq('IP.item_title', $queryBuilder->createNamedParameter('')),
                // Either the page was indexed for exactly this group list, or the
                // current user's group list has explicit access (index_grlist match).
                $queryBuilder->expr()->or(
                    $queryBuilder->expr()->eq('IP.gr_list', $groupListParameter),
                    $queryBuilder->expr()->isNotNull('IGL.phash'),
                )
            )
            ->groupBy('IP.item_title', 'IP.data_page_id')
            ->orderBy('IP.item_title', 'ASC')
            ->setMaxResults(self::MAX_PAGES)
            ->executeQuery()
            ->fetchAllAssociative();

        return array_values(array_map(
            static fn (array $row): array => [
                'title' => (string)$row['item_title'],
                'pageId' => (int)$row['data_page_id'],
            ],
            $rows
        ));
    }
}
