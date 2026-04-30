<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Schema;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Emits NewsArticle JSON-LD (single object, no script wrapper) with json_encode.
 */
final class NewsArticleJsonLdViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('articleUrl', 'string', 'Canonical absolute URL', true);
        $this->registerArgument('headline', 'string', 'Article headline', true);
        $this->registerArgument('description', 'string', 'Plain-text teaser', false, '');
        $this->registerArgument('datePublished', 'string', 'ISO 8601 datetime', false, '');
        $this->registerArgument('dateModified', 'string', 'ISO 8601 datetime', false, '');
        $this->registerArgument('imageUrl', 'string', 'Lead image absolute URL', false, '');
        $this->registerArgument('publisherName', 'string', 'Override publisher; defaults to site websiteTitle', false, '');
    }

    public function render(): string
    {
        $request = $this->getServerRequest();
        $site = $request?->getAttribute('site');
        if ($site instanceof Site) {
            $enabled = filter_var($site->getSettings()->get('structuredDataEnabled') ?? true, FILTER_VALIDATE_BOOLEAN);
            if (!$enabled) {
                return '';
            }
        }

        $publisherName = $this->resolvePublisherName();
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $this->arguments['headline'],
            'url' => $this->arguments['articleUrl'],
        ];
        if ($publisherName !== '') {
            $publisherType = $this->resolvePublisherSchemaType($site);
            $data['publisher'] = [
                '@type' => $publisherType,
                'name' => $publisherName,
            ];
        }

        $description = trim((string)$this->arguments['description']);
        if ($description !== '') {
            $data['description'] = mb_substr($description, 0, 500);
        }

        $published = trim((string)$this->arguments['datePublished']);
        if ($published !== '') {
            $data['datePublished'] = $published;
        }

        $modified = trim((string)$this->arguments['dateModified']);
        if ($modified !== '') {
            $data['dateModified'] = $modified;
        }

        $imageUrl = trim((string)$this->arguments['imageUrl']);
        if ($imageUrl !== '') {
            $data['image'] = $imageUrl;
        }

        try {
            return json_encode(
                $data,
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
            );
        } catch (\JsonException) {
            return '';
        }
    }

    private function resolvePublisherName(): string
    {
        $raw = $this->arguments['publisherName'] ?? '';
        if (is_string($raw)) {
            $name = trim($raw);
            if ($name !== '') {
                return $name;
            }
        }

        $request = $this->getServerRequest();
        $site = $request?->getAttribute('site');
        if ($site instanceof Site) {
            return trim((string)($site->getConfiguration()['websiteTitle'] ?? ''));
        }

        return '';
    }

    /**
     * Same order as mpc_sitepackage StructuredDataProcessor::resolvePublisherSchemaType().
     */
    private function resolvePublisherSchemaType(?Site $site): string
    {
        if (!$site instanceof Site) {
            return 'Person';
        }
        $settings = $site->getSettings();
        $fromSeo = trim((string)($settings->get('seo.schema.organizationType') ?? ''));
        if ($fromSeo !== '') {
            return $fromSeo;
        }
        $fromConfig = trim((string)($site->getConfiguration()['schemaType'] ?? ''));
        if ($fromConfig !== '') {
            return $fromConfig;
        }

        return 'Person';
    }

    private function getServerRequest(): ?ServerRequestInterface
    {
        if ($this->renderingContext->hasAttribute(ServerRequestInterface::class)) {
            $request = $this->renderingContext->getAttribute(ServerRequestInterface::class);
            if ($request instanceof ServerRequestInterface) {
                return $request;
            }
        }

        $fallback = $GLOBALS['TYPO3_REQUEST'] ?? null;

        return $fallback instanceof ServerRequestInterface ? $fallback : null;
    }
}
