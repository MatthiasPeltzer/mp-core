<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Support;

/**
 * Optional sysexts referenced from composer.json require-dev must be activated for
 * TYPO3 14 functional tests (PackageCollection resolves them as mp_core dependencies).
 */
final class MpCoreFunctionalTestBootstrap
{
    /**
     * Mp-core manifest core sysexts plus optional packages from composer require-dev.
     *
     * @var list<string>
     */
    public const CORE_EXTENSIONS_TO_LOAD = [
        'rte_ckeditor',
        'seo',
        'install',
        'form',
        'indexed_search',
        'redirects',
    ];
}
