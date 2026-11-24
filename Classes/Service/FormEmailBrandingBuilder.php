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

        $customFooterHtml = trim((string)($settings->get('form.email.footerText') ?? ''));
        if ($customFooterHtml === '') {
            $footerText = $this->buildDefaultFooterHtml($site, $siteLanguage, $languageConfig, $siteConfig, $settings);
            $footerTextPlain = $this->buildDefaultFooterPlain($site, $siteLanguage, $languageConfig, $siteConfig, $settings);
        } else {
            $footerText = $customFooterHtml;
            $footerTextPlain = $this->htmlFooterToPlain($customFooterHtml);
        }

        return [
            'logoUrl' => $logoUrl,
            'logoAlt' => $logoAlt,
            'homeUrl' => $this->resolveHomeUrl($site, $siteLanguage),
            'headerBackgroundColor' => $headerBackgroundColor !== '' ? $headerBackgroundColor : '#0A406E',
            'footerBackgroundColor' => $footerBackgroundColor !== '' ? $footerBackgroundColor : '#4d4d4d',
            'linkColor' => $linkColor,
            'footerText' => $footerText,
            'footerTextPlain' => $footerTextPlain,
        ];
    }

    private function resolveHomeUrl(Site $site, ?SiteLanguage $language): string
    {
        try {
            $uri = $site->getRouter()->generateUri(
                (string)$site->getRootPageId(),
                $this->routeParametersForLanguage($language),
            );

            return (string)$uri;
        } catch (\Throwable) {
            return rtrim((string)$site->getBase(), '/');
        }
    }

    /**
     * @param array<string, mixed> $languageConfig
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
        $legalLinks = $this->legalFooterLinks($site, $language, $settings);
        $htmlLinks = [];
        foreach ($legalLinks as $link) {
            $htmlLinks[] = sprintf(
                '<a href="%s" style="color:inherit;">%s</a>',
                htmlspecialchars($link['url'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                htmlspecialchars($link['label'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            );
        }

        $year = date('Y');
        $linkBlock = $htmlLinks !== [] ? '<p style="padding:8px 0 0 0;">' . implode(' · ', $htmlLinks) . '</p>' : '';

        return sprintf(
            '<p style="padding:0;">© %s %s</p>%s',
            $year,
            $copyright !== '' ? $copyright : htmlspecialchars($site->getIdentifier(), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            $linkBlock
        );
    }

    /**
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     */
    private function buildDefaultFooterPlain(
        Site $site,
        ?SiteLanguage $language,
        array $languageConfig,
        array $siteConfig,
        \TYPO3\CMS\Core\Site\Entity\SiteSettings $settings,
    ): string {
        $copyright = $this->scalarString($languageConfig['copyrightText'] ?? $siteConfig['copyrightText'] ?? '');
        $copyright = $copyright !== '' ? $copyright : $site->getIdentifier();
        $lines = [sprintf('© %s %s', date('Y'), $copyright)];

        foreach ($this->legalFooterLinks($site, $language, $settings) as $link) {
            $lines[] = $link['label'] . ': ' . $link['url'];
        }

        return implode("\n", $lines);
    }

    /**
     * @return list<array{label: string, url: string}>
     */
    private function legalFooterLinks(Site $site, ?SiteLanguage $language, \TYPO3\CMS\Core\Site\Entity\SiteSettings $settings): array
    {
        $languageId = $language !== null ? $language->getLanguageId() : 0;
        $isGerman = $languageId === 0;
        $imprintUid = (int)($settings->get('mpcConsent.imprintPage') ?? 0);
        $privacyUid = (int)($settings->get('mpcConsent.privacyPolicyPage') ?? 0);
        $links = [];

        if ($imprintUid > 0) {
            $links[] = [
                'label' => $isGerman ? 'Impressum' : 'Legal notice',
                'url' => $this->pageUrl($site, $imprintUid, $language),
            ];
        }
        if ($privacyUid > 0) {
            $links[] = [
                'label' => $isGerman ? 'Datenschutz' : 'Privacy',
                'url' => $this->pageUrl($site, $privacyUid, $language),
            ];
        }

        return $links;
    }

    private function htmlFooterToPlain(string $html): string
    {
        $normalized = preg_replace_callback(
            '#<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>#is',
            function (array $matches): string {
                $url = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $label = trim(html_entity_decode(strip_tags($matches[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                if (!$this->isSafeFooterHyperlink($url)) {
                    return $label;
                }

                return $label !== '' ? $label . ': ' . $url : $url;
            },
            $html,
        ) ?? $html;

        $text = html_entity_decode(strip_tags($normalized), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace("/[ \t]+/", ' ', $text) ?? $text;
        $text = preg_replace('/\s*\n\s*/', "\n", $text) ?? $text;

        return trim(preg_replace("/\n{3,}/", "\n\n", $text) ?? $text);
    }

    private function pageUrl(Site $site, int $pageUid, ?SiteLanguage $language): string
    {
        try {
            $uri = $site->getRouter()->generateUri(
                (string)$pageUid,
                $this->routeParametersForLanguage($language),
            );

            return (string)$uri;
        } catch (\Throwable) {
            return rtrim((string)$site->getBase(), '/') . '/?id=' . $pageUid;
        }
    }

    /**
     * @return array<string, int>
     */
    private function routeParametersForLanguage(?SiteLanguage $language): array
    {
        if ($language === null) {
            return [];
        }

        return ['_language' => $language->getLanguageId()];
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

    private function isSafeFooterHyperlink(string $url): bool
    {
        $url = trim($url);
        if ($url === '' || str_starts_with($url, '//')) {
            return false;
        }

        if (preg_match('#^[a-z][a-z0-9+.-]*:#i', $url) === 1) {
            return preg_match('#^https?://#i', $url) === 1;
        }

        return $url[0] === '/' || $url[0] === '#' || $url[0] === '?';
    }
}
