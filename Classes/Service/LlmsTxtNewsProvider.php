<?php

declare(strict_types=1);

namespace Mpc\MpCore\Service;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\FrontendRestrictionContainer;
use TYPO3\CMS\Core\Routing\InvalidRouteArgumentsException;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Resolves recent EXT:news records for the llms.txt "Latest news" section.
 *
 * Kept separate from {@see \Mpc\MpCore\Middleware\LlmsTxtMiddleware} so the
 * database access can be mocked in the middleware unit tests, and so the whole
 * feature degrades gracefully (returns an empty list) when EXT:news is not
 * installed or the storage/detail page is not configured.
 */
class LlmsTxtNewsProvider
{
    private const NEWS_TABLE = 'tx_news_domain_model_news';

    public function __construct(
        private readonly ConnectionPool $connectionPool,
        private readonly FrontendRestrictionContainer $restrictionContainer,
    ) {}

    /**
     * @param list<int> $storagePids
     * @return list<array{title: string, url: string, teaser: string}>
     */
    public function recentNews(
        Site $site,
        SiteLanguage $language,
        array $storagePids,
        int $detailPageId,
        int $limit
    ): array {
        $storagePids = array_values(array_filter($storagePids, static fn (int $pid): bool => $pid > 0));
        if ($storagePids === [] || $detailPageId <= 0 || $limit <= 0 || !$this->tableExists()) {
            return [];
        }

        $languageId = $language->getLanguageId();

        try {
            $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::NEWS_TABLE);
            $queryBuilder->setRestrictions($this->restrictionContainer);
            $queryBuilder
                ->select('uid', 'l10n_parent', 'title', 'teaser')
                ->from(self::NEWS_TABLE)
                ->where(
                    $queryBuilder->expr()->in(
                        'pid',
                        $queryBuilder->createNamedParameter($storagePids, Connection::PARAM_INT_ARRAY)
                    )
                )
                ->orderBy('datetime', 'DESC')
                ->addOrderBy('crdate', 'DESC')
                ->setMaxResults($limit);

            if ($languageId > 0) {
                $queryBuilder->andWhere(
                    $queryBuilder->expr()->eq(
                        'sys_language_uid',
                        $queryBuilder->createNamedParameter($languageId, Connection::PARAM_INT)
                    )
                );
            } else {
                $queryBuilder->andWhere(
                    $queryBuilder->expr()->in(
                        'sys_language_uid',
                        $queryBuilder->createNamedParameter([0, -1], Connection::PARAM_INT_ARRAY)
                    )
                );
            }

            $rows = $queryBuilder->executeQuery()->fetchAllAssociative();
        } catch (\Throwable) {
            return [];
        }

        $items = [];
        foreach ($rows as $row) {
            $title = trim((string)($row['title'] ?? ''));
            if ($title === '') {
                continue;
            }

            // Translated records route via their default-language parent uid.
            $routeUid = $languageId > 0
                ? (int)(($row['l10n_parent'] ?? 0) ?: ($row['uid'] ?? 0))
                : (int)($row['uid'] ?? 0);
            if ($routeUid <= 0) {
                continue;
            }

            $url = $this->buildDetailUrl($site, $language, $detailPageId, $routeUid);
            if ($url === '') {
                continue;
            }

            $items[] = [
                'title' => $title,
                'url' => $url,
                'teaser' => trim((string)($row['teaser'] ?? '')),
            ];
        }

        return $items;
    }

    private function buildDetailUrl(Site $site, SiteLanguage $language, int $detailPageId, int $newsUid): string
    {
        try {
            $uri = $site->getRouter()->generateUri(
                (string)$detailPageId,
                [
                    '_language' => $language,
                    'tx_news_pi1' => [
                        'news' => $newsUid,
                        'controller' => 'News',
                        'action' => 'detail',
                    ],
                ]
            );
        } catch (InvalidRouteArgumentsException) {
            return '';
        }

        return (string)$uri;
    }

    private function tableExists(): bool
    {
        try {
            return $this->connectionPool
                ->getConnectionForTable(self::NEWS_TABLE)
                ->createSchemaManager()
                ->tablesExist([self::NEWS_TABLE]);
        } catch (\Throwable) {
            return false;
        }
    }
}
