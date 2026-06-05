<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers;

use DOMDocument;
use DOMElement;
use Mpc\MpCore\Exception\FileException;
use Throwable;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Renders an SVG file inline with optional attributes.
 *
 * Examples:
 *   <mpc:svgInline src="EXT:mp_core/Resources/Public/Images/Logo.svg" width="200" />
 *   <mpc:svgInline image="{image}" class="icon" />
 *   <mpc:svgInline src="EXT:mp_core/Resources/Public/Images/Logo.svg" width="200" height="100"
 *       id="logo" class="logo" viewBox="0 0 100 100" data="{foo:'bar'}" />
 */
class SvgInlineViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    /** @var array<string,string> */
    private static array $inlineSvgCache = [];

    public function __construct(
        private readonly ImageService $imageService,
    ) {}

    public function initializeArguments(): void
    {
        parent::initializeArguments();
        $this->registerArgument('src', 'string', 'e.g. EXT:mp_core/Resources/Public/Images/any.svg', false, '');
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

    /**
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
     * @throws FileException
     */
    protected function getImage(array $arguments): File|FileReference
    {
        if ($arguments['src'] === '' && $arguments['image'] === null) {
            throw new FileException('You must either specify a string src or a File object.', 1678366368);
        }
        try {
            $image = $this->imageService->getImage(
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

        // Strip event-handler attributes (on*) to prevent XSS
        foreach (array_keys($attributes) as $key) {
            if (str_starts_with(strtolower((string)$key), 'on')) {
                unset($attributes[$key]);
            }
        }

        // Expand data-attributes
        if (isset($attributes['data']) && is_array($attributes['data'])) {
            foreach ($attributes['data'] as $attributeDataKey => $attributeDataValue) {
                $dataKey = (string)$attributeDataKey;
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

        $root = $dom->documentElement;
        self::sanitizeSvgDom($dom);

        foreach ($attributes as $attributeKey => $attributeValue) {
            if ($attributeValue === null) {
                continue;
            }
            $root->setAttribute((string)$attributeKey, (string)$attributeValue);
        }

        return (string)$dom->saveXML($root);
    }

    private static function sanitizeSvgDom(DOMDocument $dom): void
    {
        $dangerousTags = ['script', 'foreignObject', 'iframe', 'embed', 'object'];
        foreach ($dangerousTags as $tagName) {
            $elements = $dom->getElementsByTagName($tagName);
            while ($elements->length > 0) {
                $element = $elements->item(0);
                $element?->parentNode?->removeChild($element);
            }
        }

        $xpath = new \DOMXPath($dom);
        $allElements = $xpath->query('//*');
        if ($allElements === false) {
            return;
        }
        foreach ($allElements as $element) {
            if (!$element instanceof DOMElement) {
                continue;
            }
            $localName = strtolower($element->localName ?? '');
            $attributesToRemove = [];
            foreach ($element->attributes as $attr) {
                $attrName = $attr->nodeName;
                $attrLower = strtolower($attrName);

                if (str_starts_with($attrLower, 'on')) {
                    $attributesToRemove[] = $attrName;
                    continue;
                }

                if (!self::isUriAttribute($attrLower)) {
                    continue;
                }

                $rawValue = (string)$attr->nodeValue;
                $decoded = html_entity_decode($rawValue, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $normalized = strtolower((string)preg_replace('/\s+/', '', $decoded));

                if (str_starts_with($normalized, 'javascript:')
                    || str_starts_with($normalized, 'vbscript:')
                    || str_starts_with($normalized, 'data:')
                ) {
                    $attributesToRemove[] = $attrName;
                    continue;
                }

                // `<use>` / `<image>` can fetch remote SVGs/rasters which
                // re-introduce script vectors. Allow only same-document
                // fragment references (`#id`).
                if (($localName === 'use' || $localName === 'image')
                    && !str_starts_with(ltrim($decoded), '#')
                ) {
                    $attributesToRemove[] = $attrName;
                }
            }
            foreach ($attributesToRemove as $attrName) {
                $element->removeAttribute($attrName);
            }
        }
    }

    private static function isUriAttribute(string $attrLower): bool
    {
        return $attrLower === 'href'
            || $attrLower === 'xlink:href'
            || $attrLower === 'src';
    }
}
