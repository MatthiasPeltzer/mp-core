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
 * Custom content preview renderer to handle TYPO3 v14 compatibility issues
 * with file field rendering in backend previews
 */
class CustomContentPreviewRenderer extends StandardContentPreviewRenderer
{
    public function __construct(
        private readonly FileRepository $fileRepository,
    ) {}

    /**
     * Override the main rendering method to catch and handle exceptions
     * from file reference issues.
     *
     * @todo Remove this workaround once the TYPO3 core fixes the TypeError
     *       in BackendUtility::getThumbCodeUnlinked() for missing file references.
     *       Track: https://forge.typo3.org — search "getThumbCodeUnlinked TypeError"
     */
    public function renderPageModulePreviewContent(GridColumnItem $item): string
    {
        try {
            return parent::renderPageModulePreviewContent($item);
        } catch (\TypeError $e) {
            if (str_contains($e->getMessage(), 'getThumbCodeUnlinked')) {
                return $this->renderFallbackPreview($item);
            }
            throw $e;
        }
    }
    
    /**
     * Render a simple fallback preview when file reference issues occur
     */
    protected function renderFallbackPreview(GridColumnItem $item): string
    {
        $record = $item->getRecord()->toArray();
        $header = $record['header'] ?? '';
        $subheader = $record['subheader'] ?? '';
        $bodytext = $record['bodytext'] ?? '';
        
        $preview = '';
        
        // Try to render images
        try {
            $imagePreview = $this->renderImages($record);
            if ($imagePreview !== '') {
                $preview .= $imagePreview . '<br>';
            }
        } catch (\Throwable $e) {
            // Silently skip image rendering if it fails
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
    
    /**
     * Render image thumbnails for the record
     */
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
                        
                        // Generate thumbnail
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
                            // Skip this image if processing fails
                        }
                    }
                }
            } catch (\Throwable $e) {
                // Return empty string if file fetching fails
            }
        }
        
        return $images;
    }
}

