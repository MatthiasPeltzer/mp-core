<?php

declare(strict_types=1);

namespace Mpc\MpCore\Service;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;

/**
 * Migrates stored Bootstrap 5 class strings and markup to Bootstrap 6 conventions.
 */
final class Bootstrap6ContentMigrationService
{
    /** @var array<string, string> */
    public const LINK_LAYOUT_MAP = [
        'btn btn-primary' => 'btn btn-solid theme-primary',
        'btn btn-secondary' => 'btn btn-solid theme-secondary',
        'btn btn-tertiary' => 'btn btn-solid theme-tertiary',
        'btn btn-quaternary' => 'btn btn-solid theme-quaternary',
    ];

    /** @var list<string> */
    private const HTML_FIELDS = [
        'bodytext',
        'tx_link_text',
    ];

    public function __construct(
        private readonly ConnectionPool $connectionPool,
    ) {}

    /**
     * @return list<array{uid: int, pid: int, tx_link_layout: string}>
     */
    public function findLinkLayoutRecordsNeedingMigration(): array
    {
        $connection = $this->connectionPool->getConnectionForTable('tt_content');
        $queryBuilder = $connection->createQueryBuilder();
        $rows = $queryBuilder
            ->select('uid', 'pid', 'tx_link_layout')
            ->from('tt_content')
            ->where(
                $queryBuilder->expr()->in(
                    'tx_link_layout',
                    $queryBuilder->createNamedParameter(array_keys(self::LINK_LAYOUT_MAP), Connection::PARAM_STR_ARRAY)
                )
            )
            ->executeQuery()
            ->fetchAllAssociative();

        return array_map(
            static fn (array $row): array => [
                'uid' => (int)$row['uid'],
                'pid' => (int)$row['pid'],
                'tx_link_layout' => (string)$row['tx_link_layout'],
            ],
            $rows
        );
    }

    public function migrateAllLinkLayouts(): int
    {
        $updated = 0;
        foreach ($this->findLinkLayoutRecordsNeedingMigration() as $record) {
            $newValue = self::LINK_LAYOUT_MAP[$record['tx_link_layout']] ?? $record['tx_link_layout'];
            $this->connectionPool
                ->getConnectionForTable('tt_content')
                ->update(
                    'tt_content',
                    ['tx_link_layout' => $newValue],
                    ['uid' => $record['uid']]
                );
            ++$updated;
        }

        return $updated;
    }

    /**
     * @return list<array{uid: int, pid: int, field: string}>
     */
    public function findHtmlRecordsNeedingMigration(): array
    {
        $connection = $this->connectionPool->getConnectionForTable('tt_content');
        $needsMigration = [];

        foreach (self::HTML_FIELDS as $field) {
            if (!$this->columnExists($connection, 'tt_content', $field)) {
                continue;
            }

            $queryBuilder = $connection->createQueryBuilder();
            $likeParts = [];
            foreach (array_keys(self::LINK_LAYOUT_MAP) as $search) {
                $likeParts[] = $queryBuilder->expr()->like(
                    $field,
                    $queryBuilder->createNamedParameter('%' . $search . '%')
                );
            }
            $likeParts[] = $queryBuilder->expr()->like($field, $queryBuilder->createNamedParameter('%col-md-%'));
            $likeParts[] = $queryBuilder->expr()->like($field, $queryBuilder->createNamedParameter('%data-bs-toggle="modal"%'));
            $likeParts[] = $queryBuilder->expr()->like($field, $queryBuilder->createNamedParameter('%data-bs-toggle="dropdown"%'));
            $likeParts[] = $queryBuilder->expr()->like($field, $queryBuilder->createNamedParameter('%text-muted%'));

            $rows = $queryBuilder
                ->select('uid', 'pid')
                ->from('tt_content')
                ->where($queryBuilder->expr()->or(...$likeParts))
                ->executeQuery()
                ->fetchAllAssociative();

            foreach ($rows as $row) {
                $needsMigration[] = [
                    'uid' => (int)$row['uid'],
                    'pid' => (int)$row['pid'],
                    'field' => $field,
                ];
            }
        }

        return $needsMigration;
    }

    public function migrateAllHtmlFields(): int
    {
        $connection = $this->connectionPool->getConnectionForTable('tt_content');
        $updated = 0;
        $seen = [];

        foreach ($this->findHtmlRecordsNeedingMigration() as $record) {
            $key = $record['uid'] . ':' . $record['field'];
            if (isset($seen[$key])) {
                continue;
            }
            $seen[$key] = true;

            $queryBuilder = $connection->createQueryBuilder();
            $row = $queryBuilder
                ->select($record['field'])
                ->from('tt_content')
                ->where($queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($record['uid'], Connection::PARAM_INT)))
                ->executeQuery()
                ->fetchAssociative();

            if ($row === false) {
                continue;
            }

            $field = $record['field'];
            $original = (string)($row[$field] ?? '');
            $migrated = self::migrateHtmlFragment($original);
            if ($migrated === $original) {
                continue;
            }

            $connection->update(
                'tt_content',
                [$field => $migrated],
                ['uid' => $record['uid']]
            );
            ++$updated;
        }

        return $updated;
    }

    public static function migrateHtmlFragment(string $html): string
    {
        $out = $html;

        foreach (self::LINK_LAYOUT_MAP as $from => $to) {
            $out = str_replace($from, $to, $out);
        }

        $replacements = [
            'data-bs-toggle="modal"' => 'data-bs-toggle="dialog"',
            'data-bs-dismiss="modal"' => 'data-bs-dismiss="dialog"',
            'data-bs-toggle="dropdown"' => 'data-bs-toggle="menu"',
            'dropdown-menu' => 'menu',
            'dropdown-download' => 'menu-download',
            'dropdown-copyright' => 'menu-copyright',
            'dropdown-item' => 'menu-item',
            'dropdown-divider' => 'menu-divider',
            'text-muted' => 'fg-secondary',
            'btn-outline-primary' => 'btn-outline theme-primary',
            'btn-outline-secondary' => 'btn-outline theme-secondary',
            'data-bs-popper="static"' => '',
        ];

        foreach ($replacements as $from => $to) {
            $out = str_replace($from, $to, $out);
        }

        $breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'];
        foreach ($breakpoints as $bp) {
            $v6 = $bp === 'xxl' ? '2xl' : $bp;
            $out = (string)preg_replace('/\bcol-' . $bp . '-(\d+)\b/', $v6 . ':col-$1', $out);
            $out = (string)preg_replace('/\bd-' . $bp . '-([a-z][\w-]*)\b/', $v6 . ':d-$1', $out);
            $out = (string)preg_replace('/\b(ms|me|mt|mb|mx|my|ps|pe|pt|pb|px|py)-' . $bp . '-(\d+|auto)\b/', $v6 . ':$1-$2', $out);
        }

        $out = (string)preg_replace('/\bdrop(start|end|up|down)\b/', '', $out);
        $out = (string)preg_replace('/\s{2,}/', ' ', $out);

        return $out;
    }

    private function columnExists(Connection $connection, string $table, string $column): bool
    {
        $schemaManager = $connection->createSchemaManager();
        if (!$schemaManager->tablesExist([$table])) {
            return false;
        }

        return $schemaManager->introspectTable($table)->hasColumn($column);
    }
}
