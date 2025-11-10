<?php

namespace Mpc\MpCore\Backend\Form\Container;

use TYPO3\CMS\Core\Configuration\Exception\ExtensionConfigurationExtensionNotConfiguredException;
use TYPO3\CMS\Core\Configuration\Exception\ExtensionConfigurationPathDoesNotExistException;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class FilesControlContainer extends \TYPO3\CMS\Backend\Form\Container\FilesControlContainer
{
    /**
     * @return array<mixed>
     */
    public function render(): array
    {
        if (array_key_exists('fieldInformation', $this->data['parameterArray']['fieldConf']['config'])) {
            if (!array_key_exists('container', $this->data['processedTca']['ctrl'])) {
                $this->data['processedTca']['ctrl']['container'] = [];
            }

            if (!array_key_exists('file', $this->data['processedTca']['ctrl']['container'])) {
                $this->data['processedTca']['ctrl']['container']['file'] = [];
            }

            if (!array_key_exists('fieldInformation', $this->data['processedTca']['ctrl']['container']['file'])) {
                $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'] = [];
            }

            $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'] = array_merge(
                $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'],
                $this->data['parameterArray']['fieldConf']['config']['fieldInformation']
            );
        }

        $this->addVideoDescriptionField();

        $this->addAudioDescriptionField();

        return parent::render();
    }

    /**
     * @throws ExtensionConfigurationPathDoesNotExistException
     * @throws ExtensionConfigurationExtensionNotConfiguredException
     */
    public function addVideoDescriptionField(): void
    {
        if (! str_ends_with($this->data['parameterArray']['itemFormElName'] ?? '', '[tx_video_video]')) {
            return;
        }

        $config = GeneralUtility::makeInstance(ExtensionConfiguration::class)->get('mp_core');

        $desc = 'LLL:EXT:mp_core/Resources/Private/Language/locallang.xlf:config.allowedVideoDomains.list';
        $this->data['parameterArray']['fieldConf']['description'] =
            $this->getLanguageService()->sL($desc) . ' ' . $config['allowedVideoDomains'];
    }

    /**
     * @throws ExtensionConfigurationPathDoesNotExistException
     * @throws ExtensionConfigurationExtensionNotConfiguredException
     */
    public function addAudioDescriptionField(): void
    {
        if (! str_ends_with($this->data['parameterArray']['itemFormElName'] ?? '', '[tx_audio_audio]')) {
            return;
        }

        $config = GeneralUtility::makeInstance(ExtensionConfiguration::class)->get('mp_core');

        $desc = 'LLL:EXT:mp_core/Resources/Private/Language/locallang.xlf:config.allowedAudioDomains.list';
        $this->data['parameterArray']['fieldConf']['description'] =
            $this->getLanguageService()->sL($desc) . ' ' . $config['allowedAudioDomains'];
    }
}
