<?php

declare(strict_types=1);

namespace Mpc\MpCore\UserFunc;

use Mpc\MpCore\Service\CssColorValidator;
use TYPO3\CMS\Core\Attribute\AsAllowedCallable;
use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\Site\Entity\SiteInterface;

/**
 * Builds the items array for the color-picker TCA select, sourced from the
 * `color-N` slots of the active site configuration.
 *
 * Although site configuration is only writable by trusted backend admins, the
 * resulting values are interpolated into inline `<style>` blocks downstream
 * (Styles.html). This class therefore filters out any color value that does
 * not satisfy {@see CssColorValidator::isValid()} and caps presentation labels
 * to a sane length, so a stray value can never break the backend select UI or
 * the frontend CSS.
 */
class ColorPickerValueItems
{
    private const LABEL_MAX_LENGTH = 200;

    /**
     * @param array<string,mixed> $config
     */
    #[AsAllowedCallable]
    public function getItems(array &$config): void
    {
        $site = $config['site'] ?? null;
        if (!$site instanceof SiteInterface) {
            $config['items'] = [];
            return;
        }

        $languageService = $this->getLanguageService();
        $emptyLabel = $languageService?->sL('LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-0') ?? '';
        $items = [
            [
                'label' => $emptyLabel,
                'value' => '',
            ],
        ];

        $configuration = $site->getConfiguration();

        foreach ($configuration as $key => $rawColor) {
            if (!is_string($key) || preg_match('/^color-\d+$/', $key) !== 1) {
                continue;
            }
            if (!is_string($rawColor) || $rawColor === '') {
                continue;
            }
            $color = trim($rawColor);
            if (!CssColorValidator::isValid($color)) {
                continue;
            }

            $label = $color;
            $index = substr($key, strlen('color-'));
            $labelKey = 'label-color-' . $index;
            $customLabel = $configuration[$labelKey] ?? null;
            if (is_string($customLabel) && $customLabel !== '') {
                $label = $customLabel;
            }

            $items[] = [
                'label' => $this->sanitizeLabel($label),
                'value' => $key,
            ];
        }

        $config['items'] = $items;
    }

    /**
     * Strips control characters and caps the displayed label so a misconfigured
     * site cannot inject newlines / NUL bytes into the backend select UI.
     */
    private function sanitizeLabel(string $label): string
    {
        $clean = (string)preg_replace('/[\x00-\x1F\x7F]/u', '', $label);
        $clean = trim($clean);
        if (mb_strlen($clean) > self::LABEL_MAX_LENGTH) {
            $clean = mb_substr($clean, 0, self::LABEL_MAX_LENGTH - 1) . '…';
        }
        return $clean;
    }

    private function getLanguageService(): ?LanguageService
    {
        $languageService = $GLOBALS['LANG'] ?? null;

        return $languageService instanceof LanguageService ? $languageService : null;
    }
}
