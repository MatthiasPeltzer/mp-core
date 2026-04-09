<?php

declare(strict_types=1);

namespace Mpc\MpCore\UserFunc;

use TYPO3\CMS\Core\Attribute\AsAllowedCallable;
use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\Site\Entity\SiteInterface;

class ColorPickerValueItems
{
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
        $items = [
            [
                'label' => $languageService->sL('LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-0'),
                'value' => '',
            ],
        ];

        $configuration = $site->getConfiguration();

        $colors = array_filter(
            $configuration,
            fn(mixed $item, string $key): bool => preg_match('/^color-\d+$/', $key) === 1 && $item !== '',
            ARRAY_FILTER_USE_BOTH
        );

        foreach ($colors as $key => $color) {
            $label = (string)$color;
            $index = substr((string)$key, strlen('color-'));
            $labelKey = 'label-color-' . $index;
            if (isset($configuration[$labelKey]) && $configuration[$labelKey] !== '') {
                $label = (string)$configuration[$labelKey];
            }

            $items[] = ['label' => $label, 'value' => $key];
        }

        $config['items'] = $items;
    }

    private function getLanguageService(): LanguageService
    {
        return $GLOBALS['LANG'];
    }
}
