<?php

declare(strict_types=1);

namespace Mpc\MpCore\DataProcessing;

use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

/**
 * Data processor to extract URLs from social media configuration strings
 * that are in the format: "URL _blank - Label"
 */
final class SocialMediaProcessor implements DataProcessorInterface
{
    /**
     * Site setting keys whose URLs should not appear on extra-entity sameAs
     * (developer/professional profiles — they identify you, not the project or brand).
     *
     * @var list<string>
     */
    private const EXTRA_ENTITY_SAME_AS_EXCLUDED_FIELDS = [
        'github',
        'gitlab',
        'linkedin',
        'xing',
        'opencode',
        'packagist',
        'npmjs',
        'npm',
    ];

    /**
     * @param array<string, mixed> $contentObjectConfiguration
     * @param array<string, mixed> $processorConfiguration
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        $socialMediaFields = [
            'facebook',
            'x',
            'instagram',
            'linkedin',
            'youtube',
            'bandcamp',
            'soundcloud',
            'spotify',
            'github',
            'gitlab',
            'opencode',
            'packagist',
            'npmjs',
            'npm',
            'mastodon',
            'bluesky',
            'pinterest',
            'reddit',
            'telegram',
            'threads',
            'tiktok',
            'tumblr',
            'vimeo',
            'whatsapp',
            'xing',
            'discord',
            'signal',
        ];

        $socialMediaUrls = [];
        $extraEntitySameAsUrls = [];

        $site = $processedData['site'] ?? null;
        if ($site instanceof Site) {
            $siteConfig = $site->getConfiguration();

            foreach ($socialMediaFields as $field) {
                if (!empty($siteConfig[$field])) {
                    $value = (string)$siteConfig[$field];
                    $parts = explode(' ', $value, 2);
                    $url = trim($parts[0]);

                    if (filter_var($url, FILTER_VALIDATE_URL)) {
                        $socialMediaUrls[] = $url;
                        if (!in_array($field, self::EXTRA_ENTITY_SAME_AS_EXCLUDED_FIELDS, true)) {
                            $extraEntitySameAsUrls[] = $url;
                        }
                    }
                }
            }
        }

        $processedData['socialMediaUrls'] = array_values(array_unique($socialMediaUrls));
        $processedData['extraEntitySameAsUrls'] = array_values(array_unique($extraEntitySameAsUrls));
        $processedData['musicGroupSameAsUrls'] = $processedData['extraEntitySameAsUrls'];

        return $processedData;
    }
}
