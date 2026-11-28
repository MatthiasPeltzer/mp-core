<?php

declare(strict_types=1);

namespace Mpc\MpCore\Service;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Context\LanguageAspectFactory;
use TYPO3\CMS\Core\Context\UserAspect;
use TYPO3\CMS\Core\Context\WorkspaceAspect;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Builds a {@see PageRepository} bound to a language-specific {@see Context}, so
 * early middleware (which runs before the frontend language context is set up)
 * can fetch page menus with the correct translation overlay and fallback chain.
 *
 * Also exposes an anonymous frontend context (guest user, live workspace) for
 * public listings such as llms.txt that must not widen with the current session.
 *
 * Kept as a separate, non-final service so it can be mocked in unit tests.
 */
class LanguageAwarePageRepositoryFactory
{
    public function create(SiteLanguage $language): PageRepository
    {
        $context = $this->createPublicAccessContext($language);

        return GeneralUtility::makeInstance(PageRepository::class, $context);
    }

    public function createPublicAccessContext(SiteLanguage $language): Context
    {
        $context = clone GeneralUtility::makeInstance(Context::class);
        $context->setAspect('language', LanguageAspectFactory::createFromSiteLanguage($language));
        $context->setAspect('frontend.user', GeneralUtility::makeInstance(UserAspect::class));
        $context->setAspect('workspace', GeneralUtility::makeInstance(WorkspaceAspect::class, 0));

        return $context;
    }
}
