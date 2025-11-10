<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers;

use Closure;
use DOMDocument;
use Mpc\MpCore\Exception\FileException;
use SimpleXMLElement;
use Throwable;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
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
     * @param array $arguments
     * @param Closure $renderChildrenClosure
     * @param RenderingContextInterface $renderingContext
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

        return $this->getInlineSvg($svgContent, $attributes);
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

    protected static function getInlineSvg(string $svgContent, array $attributes = []): string
    {
        $svgElement = simplexml_load_string($svgContent);
        if ($svgElement instanceof SimpleXMLElement === false) {
            return '';
        }
        $domXml = dom_import_simplexml($svgElement);
        if ($domXml->ownerDocument instanceof DOMDocument === false) {
            return '';
        }
        foreach (self::updateAttributes($attributes) as $attributeKey => $attributeValue) {
            if ($attributeValue !== null) {
                $domXml->setAttribute($attributeKey, htmlspecialchars((string)$attributeValue));
            }
        }
        return (string)$domXml->ownerDocument->saveXML($domXml->ownerDocument->documentElement);
    }

    protected static function updateAttributes(array $attributes): array
    {
        if ($attributes['id'] !== null) {
            $attributes['id'] = htmlspecialchars(trim((string)$attributes['id']));
        }

        if (is_array($attributes['data'])) {
            foreach ($attributes['data'] as $attributeDataKey => $attributeDataValue) {
                $attributes['data-' . (string)$attributeDataKey] = htmlspecialchars((string)$attributeDataValue);
            }
            unset($attributes['data']);
        }

        return $attributes;
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
