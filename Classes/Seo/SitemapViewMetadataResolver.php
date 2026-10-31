<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Resolves human-readable labels for the XML sitemap browser view (XSL).
 */
final class SitemapViewMetadataResolver
{
    private const META_COMMENT_PREFIX = 'mpcSitemapMeta ';

    private const META_COMMENT_SEPARATOR = ' :: ';

    public function resolveWebsiteTitle(Site $site, SiteLanguage $language): string
    {
        $title = trim($language->getWebsiteTitle());
        if ($title !== '') {
            return $title;
        }

        return trim((string)($site->getConfiguration()['websiteTitle'] ?? ''));
    }

    public function resolveLanguageTitle(SiteLanguage $language): string
    {
        return trim($language->getTitle());
    }

    /**
     * Embeds site metadata in an XML comment for {@see Resources/Public/Seo/Sitemap.xsl}.
     */
    public function formatMetaComment(string $websiteTitle, string $languageTitle): string
    {
        $websiteTitle = $this->sanitizeMetaFragment($websiteTitle);
        $languageTitle = $this->sanitizeMetaFragment($languageTitle);

        return self::META_COMMENT_PREFIX . $websiteTitle . self::META_COMMENT_SEPARATOR . $languageTitle;
    }

    private function sanitizeMetaFragment(string $value): string
    {
        $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
        $value = str_replace(self::META_COMMENT_SEPARATOR, ' / ', $value);

        return str_replace('--', '-', $value);
    }
}
