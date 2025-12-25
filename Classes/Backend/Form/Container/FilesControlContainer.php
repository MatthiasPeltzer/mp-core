<?php

declare(strict_types=1);

namespace Mpc\MpCore\Backend\Form\Container;

use TYPO3\CMS\Backend\Form\Container\FilesControlContainer as CoreFilesControlContainer;

final class FilesControlContainer extends CoreFilesControlContainer
{
    /**
     * @return array<mixed>
     */
    public function render(): array
    {
        $fieldInformation = $this->data['parameterArray']['fieldConf']['config']['fieldInformation'] ?? null;
        if (!is_array($fieldInformation) || $fieldInformation === []) {
            return parent::render();
        }

        $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'] ??= [];
        $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'] = array_merge(
            $this->data['processedTca']['ctrl']['container']['file']['fieldInformation'],
            $fieldInformation
        );

        return parent::render();
    }
}
