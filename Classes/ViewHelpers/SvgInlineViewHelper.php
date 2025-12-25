<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers;

use Closure;
use DOMDocument;
use DOMElement;
use Mpc\MpCore\Exception\FileException;
use Throwable;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Class SvgInlineViewHelper
 *
 * can be used to render a SVG image inline:
 * - <mpc:resource.svgInline src="EXT:in2template/Resources/Public/Logo-small.svg" width="200"/>
 * - <mpc:resource.svgInline image="{image}" width="200"/>
 * - <mpc:resource.svgInline src="EXT:in2template/Resources/Public/Logo-small.svg" width="200" height="100" id="logo" title="Logo" class="className" viewBox="0 0 100 100" data="{foo:'bar'}" additionalAttributes="{onclick:'anything()'}"/>
 */
class SvgInlineViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    /**
     * Request-local cache for already parsed SVGs.
     * Keyed by a hash of file contents + normalized attributes.
     *
     * @var array<string,string>
     */
    private static array $inlineSvgCache = [];

    /**
     * @return string
     * @SuppressWarnings(PHPMD)
     * @throws FileException
     */
    public function render(): string
    {
        $arguments = $this->arguments;
        $image = $this->getImage($arguments);
        $svgContent = $image->getContents();

        if ($svgContent === '') {
            throw new FileException('The svg file must not be empty.', 1678366388);
        }

        $attributes = [
                'id' => $arguments['id'],
                'class' => $arguments['class'],
                'width' => $arguments['width'],
                'height' => $arguments['height'],
                'viewBox' => $arguments['viewBox'],
                'data' => $arguments['data'],
            ] + $arguments['additionalAttributes'];

        return $this->getInlineSvgCached($svgContent, $attributes);
    }

    /**
     * @param array $arguments
     * @return File|FileReference
     * @throws FileException
     */
    protected static function getImage(array $arguments): File|FileReference
    {
        if ($arguments['src'] === '' && $arguments['image'] === null) {
            throw new FileException('You must either specify a string src or a File object.', 1678366368);
        }
        try {
            $imageService = GeneralUtility::makeInstance(ImageService::class);
            $image = $imageService->getImage(
                $arguments['src'],
                $arguments['image'],
                (bool)$arguments['treatIdAsReference']
            );
        } catch (Throwable $exception) {
            throw new FileException('Could not convert given arguments to image object', 1678367678);
        }
        if ($image->getExtension() !== 'svg') {
            throw new FileException('You must provide a svg file.', 1678366371);
        }
        return $image;
    }

    protected static function getInlineSvgCached(string $svgContent, array $attributes = []): string
    {
        $normalizedAttributes = self::normalizeAttributes($attributes);
        $cacheKey = sha1($svgContent . '|' . serialize($normalizedAttributes));
        if (isset(self::$inlineSvgCache[$cacheKey])) {
            return self::$inlineSvgCache[$cacheKey];
        }

        $rendered = self::renderInlineSvg($svgContent, $normalizedAttributes);
        self::$inlineSvgCache[$cacheKey] = $rendered;
        return $rendered;
            }

    /**
     * @return array<string,scalar|null>
     */
    protected static function normalizeAttributes(array $attributes): array
    {
        // Normalize common attributes
        foreach (['id', 'class', 'width', 'height', 'viewBox'] as $key) {
            if (!array_key_exists($key, $attributes)) {
                continue;
            }
            $value = $attributes[$key];
            if ($value === null) {
                continue;
            }
            $value = trim((string)$value);
            $attributes[$key] = $value === '' ? null : $value;
        }

        // Expand data-attributes
        if (isset($attributes['data']) && is_array($attributes['data'])) {
            foreach ($attributes['data'] as $attributeDataKey => $attributeDataValue) {
                $dataKey = (string)$attributeDataKey;
                // Keep it simple: only allow common HTML attribute characters
                $dataKey = preg_replace('/[^a-zA-Z0-9_-]/', '', $dataKey) ?? '';
                if ($dataKey === '') {
                    continue;
                }
                $attributes['data-' . $dataKey] = $attributeDataValue === null ? null : (string)$attributeDataValue;
            }
            unset($attributes['data']);
        }

        return $attributes;
    }

    /**
     * @param array<string,scalar|null> $attributes
     */
    protected static function renderInlineSvg(string $svgContent, array $attributes): string
    {
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;

        $previousUseInternalErrors = libxml_use_internal_errors(true);
        try {
            $loaded = $dom->loadXML($svgContent, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previousUseInternalErrors);
        }

        if (!$loaded || !$dom->documentElement instanceof DOMElement) {
            return '';
        }

        // Ensure we only manipulate the root element (expected to be <svg>)
        $root = $dom->documentElement;
        foreach ($attributes as $attributeKey => $attributeValue) {
            if ($attributeValue === null) {
                continue;
            }
            $root->setAttribute((string)$attributeKey, (string)$attributeValue);
        }

        return (string)$dom->saveXML($root);
    }

    public function initializeArguments(): void
    {
        parent::initializeArguments();
        $this->registerArgument('src', 'string', 'e.g. EXT:in2template/Resources/Public/Images/any.svg', false, '');
        $this->registerArgument('image', 'object', 'a FAL object (File or FileReference)');
        $this->registerArgument('treatIdAsReference', 'bool', 'given src argument is a sys_file_reference record', false, false);
        $this->registerArgument('id', 'string', 'Id to set in the svg');
        $this->registerArgument('class', 'string', 'Css class(es) for the svg');
        $this->registerArgument('width', 'string', 'Width of the svg.');
        $this->registerArgument('height', 'string', 'Height of the svg.');
        $this->registerArgument('viewBox', 'string', 'Specifies the view box for the svg');
        $this->registerArgument('data', 'array', 'Array of data-attributes');
        $this->registerArgument('additionalAttributes', 'array', 'any attributes', false, []);
    }
}
