<?php

declare(strict_types=1);

namespace Mpc\MpCore\Resource\OnlineMedia\Helpers;

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Resource\Exception\OnlineMediaAlreadyExistsException;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\Folder;
use TYPO3\CMS\Core\Resource\OnlineMedia\Helpers\AbstractOnlineMediaHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class GenericExternalVideoHelper extends AbstractOnlineMediaHelper
{
    public function transformUrlToFile($url, Folder $targetFolder): ?File
    {
        $configuration = (GeneralUtility::makeInstance(ExtensionConfiguration::class))->get('mp_core');

        /** @var array<int,string> $allowedVideoDomains */
        $allowedVideoDomains = GeneralUtility::trimExplode(',', $configuration['allowedVideoDomains'] ?? '');

        if ($url === '' || count($allowedVideoDomains) === 0) {
            return null;
        }

        if (! $this->matchesAllowedDomains($url, $allowedVideoDomains)) {
            return null;
        }

        $file = $this->findExistingFileByOnlineMediaId($url, $targetFolder, $this->extension);
        if ($file !== null) {
            throw new OnlineMediaAlreadyExistsException($file, 1724163040);
        }

        $fileName = $url . '.' . $this->extension;

        return $this->createNewFile($targetFolder, $fileName, $url);
    }

    /**
     * @param ?array<int,string> $allowedVideoDomains
     */
    protected function matchesAllowedDomains(string $mediaUrl, ?array $allowedVideoDomains): bool
    {
        $mediaHost = parse_url($mediaUrl, PHP_URL_HOST);
        $mediaScheme = parse_url($mediaUrl, PHP_URL_SCHEME);

        if ($allowedVideoDomains === null || !is_string($mediaHost)) {
            return false;
        }

        foreach ($allowedVideoDomains as $domain) {
            $scheme = parse_url($domain, PHP_URL_SCHEME);
            $domain = preg_quote($domain, '#');
            $pattern = '#^' . str_replace('\\*\\.', '([a-zA-Z0-9.]+)+', $domain) . '$#i';
            if (!is_null($scheme) && $scheme !== '') {
                if ((bool)preg_match($pattern, $mediaScheme . '://' . $mediaHost)) {
                    return true;
                }
            }

            if ((bool)preg_match($pattern, $mediaHost)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getPublicUrl(File $file): ?string
    {
        return $this->getOnlineMediaId($file);
    }

    public function getPreviewImage(File $file): string
    {
        $videoUrl = $this->getOnlineMediaId($file);
        $temporaryFileName = $this->getTempFolderPath() . 'external_' . md5($videoUrl) . '.png';
        if (!file_exists($temporaryFileName)) {
            $source = GeneralUtility::getFileAbsFileName('EXT:mp_core/Resources/Public/Images/video.png');
            if ($source == '') {
                return '';
            }
            copy($source, $temporaryFileName);
            GeneralUtility::fixPermissions($temporaryFileName);
        }
        return $temporaryFileName;
    }

    /**
     * @codeCoverageIgnore
     * @return array<int,mixed>
     */
    public function getMetaData(File $file): array
    {
        return [];
    }
}
