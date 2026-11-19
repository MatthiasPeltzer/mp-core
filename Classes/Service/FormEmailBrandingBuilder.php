<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Service;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Extbase\Mvc\Request as ExtbaseRequest;

/**
 * Builds {@code emailBrand} variables for form FluidEmail templates.
 */
final class FormEmailBrandingBuilder
{
    public function __construct(
        private readonly SiteLogoResolver $siteLogoResolver,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function buildFromRequest(ExtbaseRequest|ServerRequestInterface $request): array
    {
        $site = $request->getAttribute('site');
        if (!$site instanceof Site) {
            return [];
        }

        $language = $request->getAttribute('language');
        $siteLanguage = $language instanceof SiteLanguage ? $language : null;
        $siteConfig = $site->getConfiguration();
        $languageConfig = $siteLanguage !== null ? $siteLanguage->toArray() : [];

        $settings = $site->getSettings();
        $logoReference = trim((string)($settings->get('form.email.logo') ?? ''));
        $logoUrl = $logoReference !== ''
            ? $this->siteLogoResolver->resolvePublicFileUrl($logoReference, $site)
            : '';
        $logoAlt = trim((string)($settings->get('form.email.logoAlt') ?? ''));
        $headerColorOverride = trim((string)($settings->get('form.email.headerColor') ?? ''));
        $footerColorOverride = trim((string)($settings->get('form.email.footerColor') ?? ''));

        $headerBackgroundColor = $this->validColor(
            $headerColorOverride !== '' ? $headerColorOverride : ($siteConfig['color-primary'] ?? '')
        );
        $footerBackgroundColor = $this->validColor(
            $footerColorOverride !== '' ? $footerColorOverride : ($siteConfig['color-secondary'] ?? '')
        );
        $linkColor = $this->validColor($siteConfig['color-tertiary'] ?? '') ?: '#1f5aad';

        $footerText = trim((string)($settings->get('form.email.footerText') ?? ''));
        if ($footerText === '') {
            $footerText = $this->buildDefaultFooterHtml($site, $siteLanguage, $languageConfig, $siteConfig, $settings);
        }

        return [
            'logoUrl' => $logoUrl,
            'logoAlt' => $logoAlt,
            'homeUrl' => $this->resolveHomeUrl($site, $siteLanguage),
            'headerBackgroundColor' => $headerBackgroundColor !== '' ? $headerBackgroundColor : '#0A406E',
            'footerBackgroundColor' => $footerBackgroundColor !== '' ? $footerBackgroundColor : '#4d4d4d',
            'linkColor' => $linkColor,
            'footerText' => $footerText,
        ];
    }

    private function resolveHomeUrl(Site $site, ?SiteLanguage $language): string
    {
        try {
            $languageId = $language !== null ? $language->getLanguageId() : null;
            $uri = $site->getRouter()->generateUri($site->getRootPageId(), [], '', $languageId);

            return (string)$uri;
        } catch (\Throwable) {
            return rtrim((string)$site->getBase(), '/');
        }
    }

    /**
     * @param array<string, mixed> $siteConfig
     */
    private function buildDefaultFooterHtml(
        Site $site,
        ?SiteLanguage $language,
        array $languageConfig,
        array $siteConfig,
        \TYPO3\CMS\Core\Site\Entity\SiteSettings $settings,
    ): string {
        $copyright = htmlspecialchars(
            $this->scalarString($languageConfig['copyrightText'] ?? $siteConfig['copyrightText'] ?? ''),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        );
        $languageId = $language !== null ? $language->getLanguageId() : 0;
        $isGerman = $languageId === 0;

        $imprintLabel = $isGerman ? 'Impressum' : 'Legal notice';
        $privacyLabel = $isGerman ? 'Datenschutz' : 'Privacy';

        $imprintUid = (int)($settings->get('mpcConsent.imprintPage') ?? 0);
        $privacyUid = (int)($settings->get('mpcConsent.privacyPolicyPage') ?? 0);

        $links = [];
        if ($imprintUid > 0) {
            $links[] = sprintf(
                '<a href="%s" style="color:inherit;">%s</a>',
                htmlspecialchars($this->pageUrl($site, $imprintUid, $language), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                $imprintLabel
            );
        }
        if ($privacyUid > 0) {
            $links[] = sprintf(
                '<a href="%s" style="color:inherit;">%s</a>',
                htmlspecialchars($this->pageUrl($site, $privacyUid, $language), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                $privacyLabel
            );
        }

        $year = date('Y');
        $linkBlock = $links !== [] ? '<p style="padding:8px 0 0 0;">' . implode(' · ', $links) . '</p>' : '';

        return sprintf(
            '<p style="padding:0;">© %s %s</p>%s',
            $year,
            $copyright !== '' ? $copyright : htmlspecialchars($site->getIdentifier(), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            $linkBlock
        );
    }

    private function pageUrl(Site $site, int $pageUid, ?SiteLanguage $language): string
    {
        try {
            $languageId = $language !== null ? $language->getLanguageId() : null;
            $uri = $site->getRouter()->generateUri($pageUid, [], '', $languageId);

            return (string)$uri;
        } catch (\Throwable) {
            return rtrim((string)$site->getBase(), '/') . '/?id=' . $pageUid;
        }
    }

    private function validColor(string $color): string
    {
        $color = trim($color);

        return CssColorValidator::isValid($color) ? $color : '';
    }

    private function scalarString(mixed $value): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        return trim((string)$value);
    }
}
