<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Preview;

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
 * @todo Remove once the TYPO3 core fixes these TypeErrors.
 *       Track: https://forge.typo3.org
 */
class CustomContentPreviewRenderer extends StandardContentPreviewRenderer
{
    public function __construct(
        private readonly FileRepository $fileRepository,
    ) {}

    public function renderPageModulePreviewContent(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewContent($item);
        } catch (\TypeError $e) {
            return $this->renderFallbackPreview($item);
        }
    }

    public function renderPageModulePreviewHeader(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewHeader($item);
        } catch (\TypeError $e) {
            $record = $item->getRecord()->toArray();
            return '<strong>' . htmlspecialchars((string)($record['header'] ?? '')) . '</strong>';
        }
    }

    public function renderPageModulePreviewFooter(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewFooter($item);
        } catch (\TypeError $e) {
            return '';
        }
    }
    
    protected function renderFallbackPreview(GridColumnItem $item): string
    {
        $record = $item->getRecord()->toArray();
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
            // intentionally silent — image rendering is best-effort in previews
        }
        
        if ($header !== '') {
            $preview .= '<strong>' . htmlspecialchars($header) . '</strong><br>';
        }
        
        if ($subheader !== '') {
            $preview .= '<em>' . htmlspecialchars($subheader) . '</em><br>';
        }
        
        if ($bodytext !== '') {
            $plain = trim(strip_tags((string)$bodytext));
            $excerpt = mb_substr($plain, 0, 200);
            $preview .= htmlspecialchars($excerpt) . (mb_strlen($plain) > 200 ? '…' : '');
        }
        
        return $preview ?: '[No preview available]';
    }
    
    protected function renderImages(array $record): string
    {
        $images = '';
        $maxImages = 1;
        
        if (!empty($record['uid'])) {
            try {
                $fileReferences = $this->fileRepository->findByRelation('tt_content', 'image', $record['uid']);
                
                $renderedCount = 0;
                foreach ($fileReferences as $fileReference) {
                    if ($fileReference instanceof FileReference) {
                        if ($renderedCount >= $maxImages) {
                            break;
                        }

                        $file = $fileReference->getOriginalFile();
                        
                        $processingInstructions = [
                            'width' => '150c',
                            'height' => '150c',
                        ];
                        
                        try {
                            $processedImage = $file->process(
                                ProcessedFile::CONTEXT_IMAGECROPSCALEMASK,
                                $processingInstructions
                            );
                            
                            $images .= '<img src="' . htmlspecialchars($processedImage->getPublicUrl() ?? '') . '" '
                                . 'alt="' . htmlspecialchars($fileReference->getAlternative() ?: $fileReference->getName()) . '" '
                                . 'style="max-width:150px;max-height:150px;margin-right:10px;" />';
                            $renderedCount++;
                        } catch (\Throwable $e) {
                            // intentionally silent — processing is best-effort
                        }
                    }
                }
            } catch (\Throwable $e) {
                // intentionally silent — best-effort preview
            }
        }
        
        return $images;
    }
}

