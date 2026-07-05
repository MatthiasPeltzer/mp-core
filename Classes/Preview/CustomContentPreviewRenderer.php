<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Preview;

use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerAwareTrait;
use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use TYPO3\CMS\Backend\Preview\StandardContentPreviewRenderer;
use TYPO3\CMS\Backend\View\BackendLayout\Grid\GridColumnItem;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Resource\FileRepository;
use TYPO3\CMS\Core\Resource\ProcessedFile;

/**
 * Catches TypeErrors from the TYPO3 core backend preview pipeline that are
 * triggered by missing file references or null values passed to core utilities
 * (BackendUtility::getThumbCodeUnlinked, Sanitizer::sanitize).
 *
 * Every caught throwable is logged with full record context so the team can
 * track upstream regressions instead of silently masking them. The preview
 * itself always degrades to a best-effort representation so the page module
 * never breaks for editors.
 *
 * @todo Remove once the TYPO3 core fixes these TypeErrors.
 *       Track: https://forge.typo3.org
 */
#[Autoconfigure(public: true)]
class CustomContentPreviewRenderer extends StandardContentPreviewRenderer implements LoggerAwareInterface
{
    use LoggerAwareTrait;

    public function __construct(
        private readonly FileRepository $fileRepository,
    ) {}

    public function renderPageModulePreviewContent(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewContent($item);
        } catch (\TypeError $e) {
            $this->logPreviewFailure('renderPageModulePreviewContent', $item, $e);
            return $this->renderFallbackPreview($item);
        }
    }

    public function renderPageModulePreviewHeader(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewHeader($item);
        } catch (\TypeError $e) {
            $this->logPreviewFailure('renderPageModulePreviewHeader', $item, $e);
            $record = $this->normalizeRecord($item->getRecord());
            return '<strong>' . htmlspecialchars((string)($record['header'] ?? '')) . '</strong>';
        }
    }

    public function renderPageModulePreviewFooter(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewFooter($item);
        } catch (\TypeError $e) {
            $this->logPreviewFailure('renderPageModulePreviewFooter', $item, $e);
            return '';
        }
    }

    protected function renderFallbackPreview(GridColumnItem $item): string
    {
        $record = $this->normalizeRecord($item->getRecord());
        $header = $record['header'] ?? '';
        $subheader = $record['subheader'] ?? '';
        $bodytext = $record['bodytext'] ?? '';

        $preview = '';

        try {
            $imagePreview = $this->renderImages($record);
            if ($imagePreview !== '') {
                $preview .= $imagePreview . '<br>';
            }
        } catch (\Throwable $e) {
            // Best-effort: never let preview rendering bubble up into the
            // page module. The failure is logged so we still see it.
            $this->logger?->notice(
                'mp_core preview: image rendering skipped for tt_content uid {uid}',
                ['uid' => $record['uid'] ?? null, 'exception' => $e]
            );
        }

        if ($header !== '') {
            $preview .= '<strong>' . htmlspecialchars((string)$header) . '</strong><br>';
        }

        if ($subheader !== '') {
            $preview .= '<em>' . htmlspecialchars((string)$subheader) . '</em><br>';
        }

        if ($bodytext !== '') {
            $plain = trim(strip_tags((string)$bodytext));
            $excerpt = mb_substr($plain, 0, 200);
            $preview .= htmlspecialchars($excerpt) . (mb_strlen($plain) > 200 ? '…' : '');
        }

        return $preview ?: '[No preview available]';
    }

    /**
     * @param array<string,mixed> $record
     */
    protected function renderImages(array $record): string
    {
        $images = '';
        $maxImages = 1;

        if (empty($record['uid'])) {
            return $images;
        }

        try {
            $fileReferences = $this->fileRepository->findByRelation('tt_content', 'image', $record['uid']);
        } catch (\Throwable $e) {
            $this->logger?->notice(
                'mp_core preview: findByRelation failed for tt_content uid {uid}',
                ['uid' => $record['uid'], 'exception' => $e]
            );
            return $images;
        }

        $renderedCount = 0;
        foreach ($fileReferences as $fileReference) {
            if (!$fileReference instanceof FileReference) {
                continue;
            }
            if ($renderedCount >= $maxImages) {
                break;
            }

            try {
                $processedImage = $fileReference->getOriginalFile()->process(
                    ProcessedFile::CONTEXT_IMAGECROPSCALEMASK,
                    ['width' => '150c', 'height' => '150c']
                );

                $images .= '<img src="' . htmlspecialchars($processedImage->getPublicUrl() ?? '') . '" '
                    . 'alt="' . htmlspecialchars($fileReference->getAlternative() ?: $fileReference->getName()) . '" '
                    . 'style="max-width:150px;max-height:150px;margin-right:10px;" />';
                $renderedCount++;
            } catch (\Throwable $e) {
                $this->logger?->notice(
                    'mp_core preview: image processing skipped for sys_file_reference uid {fileUid}',
                    [
                        'uid' => $record['uid'],
                        'fileUid' => $fileReference->getUid(),
                        'exception' => $e,
                    ]
                );
            }
        }

        return $images;
    }

    /**
     * Normalises the value returned by {@see GridColumnItem::getRecord()} across
     * core versions: TYPO3 v14 returns a Record value object exposing toArray(),
     * whereas v13 already returns a plain database row array.
     *
     * @return array<string, mixed>
     */
    private function normalizeRecord(mixed $record): array
    {
        if (is_object($record) && method_exists($record, 'toArray')) {
            $record = $record->toArray();
        }

        return is_array($record) ? $record : [];
    }

    private function logPreviewFailure(string $method, GridColumnItem $item, \Throwable $e): void
    {
        if ($this->logger === null) {
            return;
        }
        try {
            $record = $this->normalizeRecord($item->getRecord());
            $context = [
                'method' => $method,
                'uid' => $record['uid'] ?? null,
                'pid' => $record['pid'] ?? null,
                'CType' => $record['CType'] ?? null,
                'exception' => $e,
            ];
        } catch (\Throwable) {
            $context = ['method' => $method, 'exception' => $e];
        }
        $this->logger->warning(
            'mp_core preview: core renderer raised TypeError in {method}; falling back to safe preview',
            $context
        );
    }
}
