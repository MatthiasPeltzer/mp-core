<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

use Mpc\MpCore\EventListener\FormEmailBrandingListener;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $configurator, ContainerBuilder $containerBuilder): void {
    if (!class_exists(\TYPO3\CMS\Form\Event\BeforeEmailFinisherInitializedEvent::class)) {
        return;
    }

    unset($containerBuilder);

    $services = $configurator->services();
    $services->set(FormEmailBrandingListener::class)
        ->autowire()
        ->autoconfigure(false)
        ->tag('event.listener', [
            'identifier' => 'mpc/mp-core/form-email-branding',
            'event' => \TYPO3\CMS\Form\Event\BeforeEmailFinisherInitializedEvent::class,
            'method' => '__invoke',
        ]);
};
