<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

/*
 * Content Security Policy declarations for the mp-core extension.
 *
 * Auto-applied by TYPO3 13.4+ when at least one of these feature flags is on
 * (System > Settings > Feature Toggles):
 *   - security.frontend.enforceContentSecurityPolicy
 *   - security.frontend.reportContentSecurityPolicy
 *
 * The TYPO3 13/14 core ships a sensible default frontend policy already; this
 * file ONLY mutates it where mp-core templates legitimately need to:
 *
 *   - emit inline <style> blocks via `<f:asset.css useNonce="1">`
 *     (see Styles.html / fluid_styled_content/Layouts/Container.html)
 *   - emit inline <script> blocks via `<f:asset.script useNonce="1">`
 *     and the `<f:security.nonce()>` helper
 *     (see ThemeInit.html, StructuredData.html, news StructuredDataArticle.html)
 *   - reference data: URIs for inline SVG fallbacks shipped through SCSS
 *
 * Everything else is deliberately locked down via Set mutations so a stray
 * third-party include cannot silently relax the policy.
 *
 * Site operators can further customise per-site via `config/sites/<id>/csp.yaml`
 * (see Documentation/Configuration.md, section "Content Security Policy").
 */

use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Directive;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Mutation;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationCollection;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationMode;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Scope;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\SourceKeyword;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\SourceScheme;
use TYPO3\CMS\Core\Type\Map;

return Map::fromEntries(
    [
        Scope::frontend(),
        new MutationCollection(
            // Strict baseline: everything that doesn't have its own directive
            // must come from the same origin.
            new Mutation(MutationMode::Set, Directive::DefaultSrc, SourceKeyword::self),

            // Inline <script> blocks are nonce-gated (ThemeInit theme bootstrap,
            // application/ld+json structured data). 'strict-dynamic' is added
            // by core, so transitively loaded scripts inherit trust from the
            // nonced root script.
            new Mutation(MutationMode::Extend, Directive::ScriptSrc, SourceKeyword::nonceProxy),

            // Inline <style> blocks are nonce-gated (additionalStyles colour
            // overrides in Styles.html, per-element bg-image in
            // fluid_styled_content/Layouts/Container.html).
            new Mutation(MutationMode::Extend, Directive::StyleSrc, SourceKeyword::nonceProxy),

            // Allow data: URIs for inline SVG fallbacks rendered through SCSS
            // helpers (svg-load) and base64-encoded raster placeholders.
            new Mutation(MutationMode::Extend, Directive::ImgSrc, SourceScheme::data),

            // Fonts are self-hosted in Resources/Public/Fonts; no CDN.
            new Mutation(MutationMode::Set, Directive::FontSrc, SourceKeyword::self),

            // No XHR / fetch / WebSocket beyond own origin.
            new Mutation(MutationMode::Set, Directive::ConnectSrc, SourceKeyword::self),

            // No <object> / <embed> / <applet> at all.
            new Mutation(MutationMode::Set, Directive::ObjectSrc, SourceKeyword::none),

            // Lock down <base href> injection: only self-origin paths.
            new Mutation(MutationMode::Set, Directive::BaseUri, SourceKeyword::self),

            // Forms only post back to the same origin by default. Sites that
            // integrate an external newsletter / CRM should override this in
            // their own `config/sites/<id>/csp.yaml`.
            new Mutation(MutationMode::Set, Directive::FormAction, SourceKeyword::self),

            // Clickjacking defence: by default, mp-core sites are NOT embeddable
            // in cross-origin frames. Override per-site if a partner needs an
            // iframe embed.
            new Mutation(MutationMode::Set, Directive::FrameAncestors, SourceKeyword::self),
        ),
    ],
);
