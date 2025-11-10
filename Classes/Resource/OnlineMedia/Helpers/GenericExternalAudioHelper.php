<?php

declare(strict_types=1);

namespace Mpc\MpCore\Resource\OnlineMedia\Helpers;

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Resource\Exception\OnlineMediaAlreadyExistsException;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\Folder;
use TYPO3\CMS\Core\Resource\OnlineMedia\Helpers\AbstractOnlineMediaHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class GenericExternalAudioHelper extends AbstractOnlineMediaHelper
{
    public function transformUrlToFile($url, Folder $targetFolder): ?File
    {
        $configuration = (GeneralUtility::makeInstance(ExtensionConfiguration::class))->get('mp_core');

        /** @var array<int,string> $allowedAudioDomains */
        $allowedAudioDomains = GeneralUtility::trimExplode(',', $configuration['allowedAudioDomains'] ?? '');

        if ($url === '' || count($allowedAudioDomains) === 0) {
            return null;
        }

        if (! $this->matchesAllowedDomains($url, $allowedAudioDomains)) {
            return null;
        }

        $file = $this->findExistingFileByOnlineMediaId($url, $targetFolder, $this->extension);
        if ($file !== null) {
            throw new OnlineMediaAlreadyExistsException($file, 1733398647);
        }

        $fileName = $url . '.' . $this->extension;

        return $this->createNewFile($targetFolder, $fileName, $url);
    }

    /**
     * @param ?array<int,string> $allowedAudioDomains
     */
    protected function matchesAllowedDomains(string $mediaUrl, ?array $allowedAudioDomains): bool
    {
        $mediaHost = parse_url($mediaUrl, PHP_URL_HOST);
        $mediaScheme = parse_url($mediaUrl, PHP_URL_SCHEME);

        if ($allowedAudioDomains === null || !is_string($mediaHost)) {
            return false;
        }

        foreach ($allowedAudioDomains as $domain) {
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
        $audioUrl = $this->getOnlineMediaId($file);
        $temporaryFileName = $this->getTempFolderPath() . 'external_' . md5($audioUrl) . '.png';
        if (!file_exists($temporaryFileName)) {
            $source = GeneralUtility::getFileAbsFileName('EXT:mp_core/Resources/Public/Images/audio.png');
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
