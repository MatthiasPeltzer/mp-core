<?php

declare(strict_types=1);

namespace Mpc\MpCore\Resource\Rendering;

use TYPO3\CMS\Core\Resource\FileInterface;
use TYPO3\CMS\Core\Resource\Rendering\VideoTagRenderer;

class GenericExternalVideoRenderer extends VideoTagRenderer
{
    public function canRender(FileInterface $file): bool
    {
        return $file->getMimeType() === 'video/generic' || $file->getExtension() === 'externalvideo';
    }
}
