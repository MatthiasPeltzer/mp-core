<?php

declare(strict_types=1);

namespace Mpc\MpCore;

use Mpc\MpCore\Domain\Finishers\BrandedEmailFinisher;
use Mpc\MpCore\Service\FormEmailBrandingBuilder;
use Psr\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\DependencyInjection\Reference;
use TYPO3\CMS\Core\Mail\MailerInterface;
use TYPO3\CMS\Core\View\ViewFactoryInterface;
use TYPO3\CMS\Form\Service\FormValueResolver;
use TYPO3\CMS\Form\Service\TranslationService;

/**
 * Conditional DI when EXT:form is loaded (mp-core does not hard-require form in functional tests).
 */
return static function (ContainerConfigurator $container, ContainerBuilder $containerBuilder): void {
    $containerBuilder->addCompilerPass(new class () implements CompilerPassInterface {
        public function process(ContainerBuilder $container): void
        {
            if (!$container->hasDefinition(TranslationService::class)) {
                return;
            }
            if (!$container->hasDefinition(BrandedEmailFinisher::class)) {
                return;
            }

            $definition = $container->findDefinition(BrandedEmailFinisher::class);
            $arguments = [new Reference(FormEmailBrandingBuilder::class)];
            if ($container->hasDefinition('TYPO3\CMS\Core\Mail\TemplatedEmailFactory')) {
                $arguments[] = new Reference(EventDispatcherInterface::class);
                $arguments[] = new Reference('TYPO3\CMS\Core\Mail\TemplatedEmailFactory');
                $arguments[] = new Reference(MailerInterface::class);
            }
            $definition->setArguments($arguments);
            $definition->addTag('form.finisher');
            $definition->addMethodCall('injectViewFactory', [new Reference(ViewFactoryInterface::class)]);
            $definition->addMethodCall('injectTranslationService', [new Reference(TranslationService::class)]);
            if ($container->hasDefinition(FormValueResolver::class)) {
                $definition->addMethodCall('injectFormValueResolver', [new Reference(FormValueResolver::class)]);
            }
        }
    });
};
