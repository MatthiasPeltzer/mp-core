<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\DataProcessing;

use Mpc\MpCore\Service\WebFontCssBuilder;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\FrontendRestrictionContainer;
use TYPO3\CMS\Core\Resource\FileRepository;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

/**
 * Resolves editor-managed web fonts into a single CSS string consumed by
 * `Resources/Private/Partials/Page/Styles.html`.
 *
 * Reads `tx_mpcore_domain_model_webfontfamily` (+ inline
 * `tx_mpcore_domain_model_webfontface` children with FAL font files) from the
 * storage page configured via the `PIDs.pidWebFonts` site setting (falls back
 * to the site root page when unset/0), resolves each face's uploaded font file
 * to a public URL, and hands the validated structures to {@see WebFontCssBuilder}.
 *
 * Web fonts are intentionally not localizable: the records are language-agnostic
 * and apply to every site language.
 *
 * Output:
 *  - `webFontsCss` (string): `@font-face` rules + `:root` custom-property
 *    mapping, or '' when no usable font is configured.
 */
final class WebFontProcessor implements DataProcessorInterface
{
    private const FAMILY_TABLE = 'tx_mpcore_domain_model_webfontfamily';
    private const FACE_TABLE = 'tx_mpcore_domain_model_webfontface';

    private WebFontCssBuilder $cssBuilder;
    private ConnectionPool $connectionPool;
    private FileRepository $fileRepository;

    public function __construct(
        ?WebFontCssBuilder $cssBuilder = null,
        ?ConnectionPool $connectionPool = null,
        ?FileRepository $fileRepository = null,
    ) {
        $this->cssBuilder = $cssBuilder ?? GeneralUtility::makeInstance(WebFontCssBuilder::class);
        $this->connectionPool = $connectionPool ?? GeneralUtility::makeInstance(ConnectionPool::class);
        $this->fileRepository = $fileRepository ?? GeneralUtility::makeInstance(FileRepository::class);
    }

    /**
     * @param array<string, mixed> $contentObjectConfiguration
     * @param array<string, mixed> $processorConfiguration
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        $processedData['webFontsCss'] = '';

        $site = $processedData['site'] ?? $cObj->getRequest()->getAttribute('site');
        if (!$site instanceof Site) {
            return $processedData;
        }

        $storagePid = (int)($site->getSettings()->get('PIDs.pidWebFonts') ?? 0);
        if ($storagePid <= 0) {
            $storagePid = $site->getRootPageId();
        }

        $families = $this->loadFamilies($storagePid);
        if ($families === []) {
            return $processedData;
        }

        $processedData['webFontsCss'] = $this->cssBuilder->build($families);

        return $processedData;
    }

    /**
     * @return list<array{
     *     name: string,
     *     fallback: string,
     *     role: string,
     *     cssVariable: string,
     *     fontDisplay: string,
     *     faces: list<array{url: string, extension: string, weight: string, style: string, unicodeRange: string}>
     * }>
     */
    private function loadFamilies(int $storagePid): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::FAMILY_TABLE);
        $queryBuilder->setRestrictions(GeneralUtility::makeInstance(FrontendRestrictionContainer::class));

        $rows = $queryBuilder
            ->select('*')
            ->from(self::FAMILY_TABLE)
            ->where(
                $queryBuilder->expr()->eq(
                    'pid',
                    $queryBuilder->createNamedParameter($storagePid, Connection::PARAM_INT)
                )
            )
            ->orderBy('name', 'ASC')
            ->executeQuery()
            ->fetchAllAssociative();

        $families = [];

        foreach ($rows as $row) {
            $faces = $this->loadFaces((int)$row['uid']);
            if ($faces === []) {
                continue;
            }

            $families[] = [
                'name' => (string)($row['name'] ?? ''),
                'fallback' => (string)($row['fallback'] ?? ''),
                'role' => (string)($row['role'] ?? 'body'),
                'cssVariable' => (string)($row['css_variable'] ?? ''),
                'fontDisplay' => (string)($row['font_display'] ?? 'swap'),
                'faces' => $faces,
            ];
        }

        return $families;
    }

    /**
     * @return list<array{url: string, extension: string, weight: string, style: string, unicodeRange: string}>
     */
    private function loadFaces(int $familyUid): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::FACE_TABLE);
        $queryBuilder->setRestrictions(GeneralUtility::makeInstance(FrontendRestrictionContainer::class));

        $rows = $queryBuilder
            ->select('*')
            ->from(self::FACE_TABLE)
            ->where(
                $queryBuilder->expr()->eq(
                    'parentid',
                    $queryBuilder->createNamedParameter($familyUid, Connection::PARAM_INT)
                ),
                $queryBuilder->expr()->eq(
                    'parenttable',
                    $queryBuilder->createNamedParameter(self::FAMILY_TABLE)
                )
            )
            ->orderBy('sorting', 'ASC')
            ->executeQuery()
            ->fetchAllAssociative();

        $faces = [];

        foreach ($rows as $row) {
            $fileData = $this->resolveFontFile((int)$row['uid']);
            if ($fileData === null) {
                continue;
            }

            $faces[] = [
                'url' => $fileData['url'],
                'extension' => $fileData['extension'],
                'weight' => (string)($row['weight'] ?? '400'),
                'style' => (string)($row['font_style'] ?? 'normal'),
                'unicodeRange' => (string)($row['unicode_range'] ?? ''),
            ];
        }

        return $faces;
    }

    /**
     * @return array{url: string, extension: string}|null
     */
    private function resolveFontFile(int $faceUid): ?array
    {
        $references = $this->fileRepository->findByRelation(self::FACE_TABLE, 'file', $faceUid);
        $reference = $references[0] ?? null;
        if ($reference === null) {
            return null;
        }

        $url = (string)$reference->getPublicUrl();
        if ($url === '') {
            return null;
        }

        return [
            'url' => $url,
            'extension' => strtolower($reference->getExtension()),
        ];
    }
}
