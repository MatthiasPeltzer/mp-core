<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\EventListener;

use Mpc\MpCore\Service\FormEmailBrandingBuilder;
use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Form\Event\BeforeEmailFinisherInitializedEvent;

/**
 * Injects per-site branding variables into form FluidEmail templates.
 */
final class FormEmailBrandingListener
{
    public function __construct(
        private readonly FormEmailBrandingBuilder $formEmailBrandingBuilder,
    ) {}

    #[AsEventListener('mpc/mp-core/form-email-branding')]
    public function __invoke(BeforeEmailFinisherInitializedEvent $event): void
    {
        $options = $event->getOptions();
        $request = $event->getFinisherContext()->getRequest();
        $emailBrand = $this->formEmailBrandingBuilder->buildFromRequest($request);
        if ($emailBrand === []) {
            return;
        }

        $variables = is_array($options['variables'] ?? null) ? $options['variables'] : [];
        $variables['emailBrand'] = $emailBrand;
        $options['variables'] = $variables;
        $event->setOptions($options);
    }
}
