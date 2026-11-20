<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Domain\Finishers;

use Mpc\MpCore\Service\FormEmailBrandingBuilder;
use Psr\EventDispatcher\EventDispatcherInterface;
use TYPO3\CMS\Core\Mail\MailerInterface;
use TYPO3\CMS\Core\Mail\TemplatedEmailFactory;
use TYPO3\CMS\Form\Domain\Finishers\EmailFinisher;

/**
 * Injects per-site {@code emailBrand} variables into form FluidEmail finishers (TYPO3 13.4 + 14).
 */
final class BrandedEmailFinisher extends EmailFinisher
{
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        TemplatedEmailFactory $templatedEmailFactory,
        MailerInterface $mailer,
        private readonly FormEmailBrandingBuilder $formEmailBrandingBuilder,
    ) {
        parent::__construct($eventDispatcher, $templatedEmailFactory, $mailer);
    }

    protected function executeInternal(): void
    {
        $this->mergeEmailBrandIntoOptions();
        parent::executeInternal();
    }

    private function mergeEmailBrandIntoOptions(): void
    {
        $request = $this->finisherContext->getRequest();
        $emailBrand = $this->formEmailBrandingBuilder->buildFromRequest($request);
        if ($emailBrand === []) {
            return;
        }

        $variables = is_array($this->options['variables'] ?? null) ? $this->options['variables'] : [];
        $variables['emailBrand'] = $emailBrand;
        $this->options['variables'] = $variables;
    }
}
