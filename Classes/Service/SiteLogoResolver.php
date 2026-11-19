<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Service;

use TYPO3\CMS\Core\Resource\Exception\ResourceDoesNotExistException;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Resolves site logo file references using the same cascades as {@see \Mpc\MpCore\DataProcessing\HeaderLogoProcessor}.
 */
final class SiteLogoResolver
{
    /**
     * @var list<array{0: 'language'|'site', 1: string}>
     */
    private const CASCADE_LOGO_SMALL = [
        ['language', 'logoSmall'],
        ['site', 'logoSmall'],
        ['language', 'logoBig'],
        ['site', 'logoBig'],
    ];

    public function __construct(
        private readonly ResourceFactory $resourceFactory,
    ) {}

    /**
     * Returns the combined file reference for the mail header (prefers the small logo cascade).
     */
    public function resolveMailLogoReference(Site $site, ?SiteLanguage $language): string
    {
        $siteConfig = $site->getConfiguration();
        $languageConfig = $language !== null ? $language->toArray() : [];

        return $this->resolveString($languageConfig, $siteConfig, self::CASCADE_LOGO_SMALL);
    }

    /**
     * Resolves a t3:// file reference to an absolute public URL suitable for &lt;img src&gt;.
     */
    public function resolvePublicFileUrl(string $fileReference, Site $site): string
    {
        if ($fileReference === '' || !str_starts_with($fileReference, 't3://')) {
            return '';
        }

        try {
            $file = $this->resourceFactory->getFileObjectFromCombinedIdentifier($fileReference);
        } catch (ResourceDoesNotExistException) {
            return '';
        }

        $publicUrl = $file->getPublicUrl() ?? '';
        if ($publicUrl === '') {
            return '';
        }

        if (str_starts_with($publicUrl, 'http://') || str_starts_with($publicUrl, 'https://')) {
            return $publicUrl;
        }

        return rtrim((string)$site->getBase(), '/') . '/' . ltrim($publicUrl, '/');
    }

    /**
     * @param array<string, mixed> $languageConfig
     * @param array<string, mixed> $siteConfig
     * @param list<array{0: 'language'|'site', 1: string}> $cascade
     */
    private function resolveString(array $languageConfig, array $siteConfig, array $cascade): string
    {
        foreach ($cascade as [$scope, $key]) {
            $source = $scope === 'language' ? $languageConfig : $siteConfig;
            $value = $this->scalarString($source[$key] ?? '');
            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }

    private function scalarString(mixed $value): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        return trim((string)$value);
    }
}
