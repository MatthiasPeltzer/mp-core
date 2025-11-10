<?php

declare(strict_types=1);

namespace Mpc\MpCore\UserFunc;

use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\Site\Entity\SiteInterface;

class ColorPickerValueItems
{
    /**
     * @param array<string,mixed> $config
     */
    public function getItems(array &$config): void
    {
        /** @var SiteInterface $site */
        $site = $config['site'];
        $items = [
            [
                $this->getLanguageService()->sL('LLL:EXT:mp_core/Resources/Private/Language/locallang_db.xlf:site.configuration.color-0'),
                '',
            ],
        ];
        if (!method_exists($site, 'getConfiguration')) {
            $config['items'] = [];
            return;
        }

        $configuration = $site->getConfiguration();

        $colors = array_filter(
            $configuration,
            function ($item, $key) { return (int)preg_match('/^color-[0-9]+$/', $key) > 0 && $item !== ''; },
            ARRAY_FILTER_USE_BOTH
        );

        foreach ($colors as $key => $color) {
            $label = $color;
            if (isset($configuration['label-color-' . substr($key, -1)]) && $configuration['label-color-' . substr($key, -1)] !== '') {
                $label = $configuration['label-color-' . substr($key, -1)];
            }

            $items[] = [$label, $key];
        }

        $config['items'] = $items;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getLanguageService(): LanguageService
    {
        return $GLOBALS['LANG'];
    }
}
