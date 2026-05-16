<?php

declare(strict_types=1);

namespace Mpc\MpCore\DataProcessing;

use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

/**
 * Resolves the header-logo settings for the *active* language exactly once per
 * page render.
 *
 * Replaces five nested `<f:for>` / `<f:if>` blocks at the top of
 * `Resources/Private/Partials/Page/Header.Logo.html` (one per variable, each
 * walking `site.configuration.languages` to pick the active language). The old
 * shape produced O(L * V) Fluid evaluations per page (L = languages,
 * V = logo variables) plus up to two `<f:render partial="Header.LogoImage">`
 * invocations per variable inside the template-driven fallback chain — all
 * pre-rendered into strings and then re-emitted via `f:format.raw`, which also
 * blocked the related XSS hardening from Finding #3.
 *
 * SCOPE COUPLING (important):
 *
 * Each toggle (`logoSvg`, `logoTextHidden`) is paired with the file/text it
 * applies to, taking its value from the *same scope* (per-language vs site)
 * that supplied the file/text. This matches the original template's
 * per-`<f:render>` argument coupling — `arguments="{logoFile: lang.logoBig,
 * preferSvg: lang.logoSvg}"` vs `arguments="{logoFile: site.logoBig,
 * preferSvg: site.logoSvg}"`.
 *
 * A naïve "language → site" fallback for the flags alone breaks the user-visible
 * BE toggle: the per-language `logoSvg` defaults to `1` (see TCA) and stays `1`
 * in the YAML even after the editor only flips the *site-level* switch. Reading
 * the language scope first would then mask the site toggle entirely.
 *
 * Output variables added to `$processedData`:
 *
 * - `logoBig` (string):       Active language `logoBig` → site `logoBig` → ''.
 * - `logoSvgBig` (bool):      The `logoSvg` flag from the scope that supplied
 *                             `logoBig` (defaults to `true` if no file).
 * - `logoSmall` (string):     Active language `logoSmall` → site `logoSmall` →
 *                             active language `logoBig` → site `logoBig` → ''.
 * - `logoSvgSmall` (bool):    The `logoSvg` flag from the scope that supplied
 *                             `logoSmall` (defaults to `true` if no file).
 * - `logoText` (string):      Active language `logoText` → site `logoText` → ''.
 * - `logoTextHidden` (bool):  The `logoTextHidden` flag from the scope that
 *                             supplied `logoText` (defaults to `false` if no
 *                             text). For the empty-`logoText` case the value
 *                             is irrelevant — the template skips the wrapper.
 * - `websiteTitle` (string):  Active language `websiteTitle` (no site fallback,
 *                             matches the pre-refactor template behaviour;
 *                             TYPO3 still exposes the site-level value via
 *                             `{site.configuration.websiteTitle}` separately).
 *
 * The values are file references (`t3://file?uid=N` strings) / plain text /
 * booleans — *not* pre-rendered HTML. The template invokes `Header.LogoImage`
 * directly via `<f:render>` so that the partial output flows through Fluid's
 * normal escaping pipeline and the `f:format.raw` calls on `logoBig` /
 * `logoSmall` / `logoText` go away.
 */
final class HeaderLogoProcessor implements DataProcessorInterface
{
    /**
     * Cascade for the *big* logo. Each entry is `[scope, key]`; the first
     * scope that has a non-empty value wins.
     *
     * @var list<array{0: 'language'|'site', 1: string}>
     */
    private const CASCADE_LOGO_BIG = [
        ['language', 'logoBig'],
        ['site', 'logoBig'],
    ];

    /**
     * Cascade for the *small* logo. Mirrors the original template's chain
     * exactly: `lang.small → site.small → lang.big → site.big`.
     *
     * @var list<array{0: 'language'|'site', 1: string}>
     */
    private const CASCADE_LOGO_SMALL = [
        ['language', 'logoSmall'],
        ['site', 'logoSmall'],
        ['language', 'logoBig'],
        ['site', 'logoBig'],
    ];

    /**
     * Cascade for `logoText`. Same pattern as the file cascades; no site →
     * language *cross-key* fallback, because `logoText` and `logoBig` are
     * independent assets.
     *
     * @var list<array{0: 'language'|'site', 1: string}>
     */
    private const CASCADE_LOGO_TEXT = [
        ['language', 'logoText'],
        ['site', 'logoText'],
    ];

    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        $request = $cObj->getRequest();
        $site = $request->getAttribute('site');
        $language = $request->getAttribute('language');

        $siteConfig = $site instanceof Site ? $site->getConfiguration() : [];
        $languageConfig = $language instanceof SiteLanguage ? $language->toArray() : [];

        [$processedData['logoBig'], $bigScope] = $this->resolveString($languageConfig, $siteConfig, self::CASCADE_LOGO_BIG);
        [$processedData['logoSmall'], $smallScope] = $this->resolveString($languageConfig, $siteConfig, self::CASCADE_LOGO_SMALL);
        [$processedData['logoText'], $textScope] = $this->resolveString($languageConfig, $siteConfig, self::CASCADE_LOGO_TEXT);

        // Pair each toggle with the scope that supplied its companion value.
        // The TCA defaults (`logoSvg => 1`, `logoTextHidden => 0`) are applied
        // when the scope is missing the key or the file/text fell through.
        $processedData['logoSvgBig'] = $this->boolFromScope($languageConfig, $siteConfig, $bigScope, 'logoSvg', true);
        $processedData['logoSvgSmall'] = $this->boolFromScope($languageConfig, $siteConfig, $smallScope, 'logoSvg', true);
        $processedData['logoTextHidden'] = $this->boolFromScope($languageConfig, $siteConfig, $textScope, 'logoTextHidden', false);

        $processedData['websiteTitle'] = $this->scalarString($languageConfig['websiteTitle'] ?? '');

        return $processedData;
    }

    /**
     * Walks the cascade in order; returns `[value, scope]` for the first
     * non-empty hit, or `['', null]` if every scope is empty.
     *
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     * @param list<array{0: 'language'|'site', 1: string}> $cascade
     * @return array{0: string, 1: 'language'|'site'|null}
     */
    private function resolveString(array $languageConfig, array $siteConfig, array $cascade): array
    {
        foreach ($cascade as [$scope, $key]) {
            $source = $scope === 'language' ? $languageConfig : $siteConfig;
            $value = $this->scalarString($source[$key] ?? '');
            if ($value !== '') {
                return [$value, $scope];
            }
        }

        return ['', null];
    }

    /**
     * Reads a boolean toggle from the named scope (`'language'` or `'site'`).
     * Returns `$default` if the scope is `null` (the companion file/text fell
     * through the cascade) or the key is missing/empty.
     *
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     * @param 'language'|'site'|null $scope
     */
    private function boolFromScope(array $languageConfig, array $siteConfig, ?string $scope, string $key, bool $default): bool
    {
        if ($scope === null) {
            return $default;
        }
        $source = $scope === 'language' ? $languageConfig : $siteConfig;
        if (!array_key_exists($key, $source) || $source[$key] === '' || $source[$key] === null) {
            return $default;
        }

        return filter_var($source[$key], FILTER_VALIDATE_BOOLEAN);
    }

    private function scalarString(mixed $value): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        return trim((string)$value);
    }
}
