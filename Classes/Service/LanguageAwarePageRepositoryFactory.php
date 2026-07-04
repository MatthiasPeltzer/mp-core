<?php

declare(strict_types=1);

namespace Mpc\MpCore\Service;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Context\LanguageAspectFactory;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Builds a {@see PageRepository} bound to a language-specific {@see Context}, so
 * early middleware (which runs before the frontend language context is set up)
 * can fetch page menus with the correct translation overlay and fallback chain.
 *
 * Kept as a separate, non-final service so it can be mocked in unit tests.
 */
class LanguageAwarePageRepositoryFactory
{
    public function create(SiteLanguage $language): PageRepository
    {
        $context = clone GeneralUtility::makeInstance(Context::class);
        $context->setAspect('language', LanguageAspectFactory::createFromSiteLanguage($language));

        return GeneralUtility::makeInstance(PageRepository::class, $context);
    }
}
