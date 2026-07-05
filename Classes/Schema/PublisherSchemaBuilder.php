<?php

declare(strict_types=1);

namespace Mpc\MpCore\Schema;

use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteSettings;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

/**
 * Assembles the Schema.org publisher node (Organization / Person) shared by
 * {@see \Mpc\MpCore\DataProcessing\StructuredDataProcessor} (site-wide @graph)
 * and {@see \Mpc\MpCore\ViewHelpers\Schema\NewsArticleJsonLdViewHelper}
 * (NewsArticle.publisher), so both emit byte-identical publisher information.
 *
 * Publisher @type resolution order:
 * 1) site.settings seo.schema.organizationType (mp-core-seo Site Settings)
 * 2) site.configuration schemaType (site YAML / Site Configuration)
 * 3) default Person
 *
 * Identity/contact/address details come from the mp-core-seo Site Settings
 * (seo.schema.*); the name, url, logo and sameAs come from Site Configuration.
 */
final class PublisherSchemaBuilder
{
    public const DEFAULT_PUBLISHER_TYPE = 'Person';

    /**
     * Builds the publisher graph node.
     *
     * @param array<int, string> $sameAs Validated social profile URLs.
     * @return array<string, mixed>
     */
    public function build(
        ContentObjectRenderer $cObj,
        Site $site,
        string $homeUrl,
        string $publisherId,
        array $sameAs
    ): array {
        $siteConfig = $site->getConfiguration();
        $settings = $site->getSettings();
        $type = $this->resolvePublisherType($site);
        $isPerson = $type === self::DEFAULT_PUBLISHER_TYPE;

        $publisher = [
            '@type' => $type,
            '@id' => $publisherId,
            'name' => (string)($siteConfig['websiteTitle'] ?? ''),
            'url' => $homeUrl,
        ];

        if ($isPerson) {
            $publisher['givenName'] = trim((string)($siteConfig['schemaGivenName'] ?? ''));
            $publisher['familyName'] = trim((string)($siteConfig['schemaFamilyName'] ?? ''));
            $publisher['jobTitle'] = $this->setting($settings, 'seo.schema.person.jobTitle');
        } else {
            $publisher['legalName'] = $this->setting($settings, 'seo.schema.legalName');
            $publisher['foundingDate'] = $this->setting($settings, 'seo.schema.foundingDate');
            $publisher['vatID'] = $this->setting($settings, 'seo.schema.vatId');
            $publisher['taxID'] = $this->setting($settings, 'seo.schema.taxId');
        }

        $publisher['alternateName'] = $this->setting($settings, 'seo.schema.alternateName');
        $description = $this->setting($settings, 'seo.schema.description');
        if ($description !== '') {
            $publisher['description'] = mb_substr($description, 0, 500);
        }
        $publisher['knowsAbout'] = $this->commaSeparated($settings, 'seo.schema.knowsAbout');
        $publisher['email'] = $this->setting($settings, 'seo.schema.email');
        $publisher['telephone'] = $this->setting($settings, 'seo.schema.telephone');
        $publisher['logo'] = $this->buildImageObject($cObj, (string)($siteConfig['logoBig'] ?? ''));
        $publisher['address'] = $this->buildAddress($settings);
        $publisher['contactPoint'] = $this->buildContactPoint($settings);
        $publisher['sameAs'] = array_values($sameAs);

        return array_filter($publisher, static fn($value) => $value !== '' && $value !== []);
    }

    /**
     * Resolves the publisher @type. Single source of truth for the whole extension.
     */
    public function resolvePublisherType(Site $site): string
    {
        $fromSeo = trim((string)($site->getSettings()->get('seo.schema.organizationType') ?? ''));
        if ($fromSeo !== '') {
            return $fromSeo;
        }

        $fromConfig = trim((string)($site->getConfiguration()['schemaType'] ?? ''));
        if ($fromConfig !== '') {
            return $fromConfig;
        }

        return self::DEFAULT_PUBLISHER_TYPE;
    }

    /**
     * Resolves a FAL image reference to an absolute-URL ImageObject with dimensions.
     *
     * @return array<string, mixed>
     */
    public function buildImageObject(ContentObjectRenderer $cObj, string $reference): array
    {
        if ($reference === '') {
            return [];
        }
        $image = $cObj->getImgResource($reference, ['treatIdAsReference' => 1]);
        if (!is_array($image) || empty($image[3])) {
            return [];
        }
        $normalizedParams = $cObj->getRequest()->getAttribute('normalizedParams');
        if ($normalizedParams === null) {
            return [];
        }

        $object = [
            '@type' => 'ImageObject',
            'url' => $normalizedParams->getSiteUrl() . ltrim((string)$image[3], '/'),
        ];
        if (!empty($image[0])) {
            $object['width'] = (int)$image[0];
        }
        if (!empty($image[1])) {
            $object['height'] = (int)$image[1];
        }

        return $object;
    }

    /**
     * Absolute frontend URL for a page uid (forceAbsoluteUrl).
     */
    public function absolutePageUrl(ContentObjectRenderer $cObj, int $pageUid): string
    {
        if ($pageUid <= 0) {
            return '';
        }

        return $cObj->typoLink_URL([
            'parameter' => $pageUid,
            'forceAbsoluteUrl' => true,
        ]) ?: '';
    }

    /**
     * @return array<string, mixed>
     */
    private function buildAddress(SiteSettings $settings): array
    {
        $address = array_filter([
            '@type' => 'PostalAddress',
            'streetAddress' => $this->setting($settings, 'seo.schema.address.streetAddress'),
            'addressLocality' => $this->setting($settings, 'seo.schema.address.addressLocality'),
            'postalCode' => $this->setting($settings, 'seo.schema.address.postalCode'),
            'addressRegion' => $this->setting($settings, 'seo.schema.address.addressRegion'),
            'addressCountry' => $this->setting($settings, 'seo.schema.address.addressCountry'),
        ], static fn($value) => $value !== '');

        // Only emit when at least one address component beyond @type is present.
        return count($address) > 1 ? $address : [];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildContactPoint(SiteSettings $settings): array
    {
        $telephone = $this->setting($settings, 'seo.schema.contactPoint.telephone');
        $email = $this->setting($settings, 'seo.schema.contactPoint.email');

        // A ContactPoint without a reachable channel carries no information.
        if ($telephone === '' && $email === '') {
            return [];
        }

        $contactPoint = array_filter([
            '@type' => 'ContactPoint',
            'contactType' => $this->setting($settings, 'seo.schema.contactPoint.contactType'),
            'telephone' => $telephone,
            'email' => $email,
            'areaServed' => $this->setting($settings, 'seo.schema.contactPoint.areaServed'),
            'availableLanguage' => $this->commaSeparated($settings, 'seo.schema.contactPoint.availableLanguage'),
        ], static fn($value) => $value !== '' && $value !== []);

        return $contactPoint;
    }

    /**
     * Reads a comma-separated setting into a Schema.org value: an empty array
     * when unset, a scalar for a single entry, or a list for several.
     *
     * @return list<string>|string
     */
    private function commaSeparated(SiteSettings $settings, string $key): array|string
    {
        $raw = $this->setting($settings, $key);
        if ($raw === '') {
            return [];
        }

        $values = array_values(array_filter(array_map(trim(...), explode(',', $raw))));
        if ($values === []) {
            return [];
        }

        return count($values) === 1 ? $values[0] : $values;
    }

    private function setting(SiteSettings $settings, string $key): string
    {
        return trim((string)($settings->get($key) ?? ''));
    }
}
