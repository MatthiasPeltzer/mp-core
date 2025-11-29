<?php

namespace Mpc\MpCore\Backend\Form\Container;

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

    return parent::render();
}
}
