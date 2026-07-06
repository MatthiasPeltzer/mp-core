<?php

declare(strict_types=1);

namespace Mpc\MpCore\ViewHelpers\Schema;

use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Emits FAQPage JSON-LD (single object, no script wrapper) from accordion child records.
 */
final class FaqPageJsonLdViewHelper extends AbstractViewHelper
{
    use ServerRequestViewHelperTrait;

    protected $escapeOutput = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('items', 'array', 'Accordion child content records', true);
    }

    public function render(): string
    {
        if (!$this->isStructuredDataEnabled()) {
            return '';
        }

        $mainEntity = $this->buildMainEntity($this->arguments['items'] ?? []);
        if ($mainEntity === []) {
            return '';
        }

        $payload = [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $mainEntity,
        ];

        try {
            return json_encode(
                $payload,
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
            );
        } catch (\JsonException) {
            return '';
        }
    }

    /**
     * @param mixed $items
     * @return list<array<string, mixed>>
     */
    private function buildMainEntity(mixed $items): array
    {
        if (!is_iterable($items)) {
            return [];
        }

        $questions = [];
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $question = trim((string)($item['header'] ?? ''));
            $answer = $this->plainText((string)($item['bodytext'] ?? ''));
            if ($question === '' || $answer === '') {
                continue;
            }

            $questions[] = [
                '@type' => 'Question',
                'name' => $question,
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => mb_substr($answer, 0, 5000),
                ],
            ];
        }

        return $questions;
    }

    private function isStructuredDataEnabled(): bool
    {
        $request = $this->getServerRequest();
        $site = $request?->getAttribute('site');
        if (!$site instanceof Site) {
            return true;
        }

        $settings = $site->getSettings();

        return filter_var($settings->get('structuredDataEnabled') ?? true, FILTER_VALIDATE_BOOLEAN)
            && filter_var($settings->get('seo.schema.enabled') ?? true, FILTER_VALIDATE_BOOLEAN);
    }

    private function plainText(string $html): string
    {
        if ($html === '') {
            return '';
        }
        $breaks = str_ireplace(['<br>', '<br/>', '<br />'], "\n", $html);

        return trim(preg_replace('/\s+/u', ' ', strip_tags($breaks)) ?? '');
    }
}
