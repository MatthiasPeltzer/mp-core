<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Schema;

use Mpc\MpCore\Schema\PublisherSchemaBuilder;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Emits NewsArticle JSON-LD (single object, no script wrapper) with json_encode.
 *
 * The publisher is assembled by the shared {@see PublisherSchemaBuilder} so it
 * carries the same @type, logo and @id as the site-wide @graph publisher (which
 * is always present in the page head, even on news detail); consumers that merge
 * by @id therefore see one complete publisher node.
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
        $this->registerArgument('author', 'string', 'Author display name; defaults to site websiteTitle', false, '');
        $this->registerArgument('publisherName', 'string', 'Override publisher name; defaults to site websiteTitle', false, '');
    }

    public function render(): string
    {
        $request = $this->getServerRequest();
        $site = $request?->getAttribute('site');
        if ($site instanceof Site && !$this->isStructuredDataEnabled($site)) {
            return '';
        }

        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $this->arguments['headline'],
            'url' => $this->arguments['articleUrl'],
            'mainEntityOfPage' => $this->arguments['articleUrl'],
        ];

        $author = trim((string)($this->arguments['author'] ?? ''));
        if ($author === '') {
            $author = $this->resolvePublisherName();
        }
        if ($author !== '') {
            $data['author'] = ['@type' => 'Person', 'name' => $author];
        }

        $publisher = $this->buildPublisher($request, $site instanceof Site ? $site : null);
        if ($publisher !== []) {
            $data['publisher'] = $publisher;
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

    /**
     * Builds the publisher node via the shared builder (incl. logo). Without a
     * resolvable Site it falls back to a minimal Person publisher for an
     * explicit publisherName override.
     *
     * @return array<string, mixed>
     */
    private function buildPublisher(?ServerRequestInterface $request, ?Site $site): array
    {
        $override = trim((string)($this->arguments['publisherName'] ?? ''));

        if (!$site instanceof Site || !$request instanceof ServerRequestInterface) {
            return $override !== '' ? ['@type' => 'Person', 'name' => $override] : [];
        }

        $builder = GeneralUtility::makeInstance(PublisherSchemaBuilder::class);
        $cObj = GeneralUtility::makeInstance(ContentObjectRenderer::class);
        $cObj->setRequest($request);

        $homeUrl = $builder->absolutePageUrl($cObj, $site->getRootPageId());
        $publisherId = $homeUrl !== '' ? $homeUrl . '#publisher' : '';
        $publisher = $builder->build($cObj, $site, $homeUrl, $publisherId, []);

        if ($override !== '' && $publisher !== []) {
            $publisher['name'] = $override;
        }

        return $publisher;
    }

    private function isStructuredDataEnabled(Site $site): bool
    {
        $settings = $site->getSettings();

        return filter_var($settings->get('structuredDataEnabled') ?? true, FILTER_VALIDATE_BOOLEAN)
            && filter_var($settings->get('seo.schema.enabled') ?? true, FILTER_VALIDATE_BOOLEAN);
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
