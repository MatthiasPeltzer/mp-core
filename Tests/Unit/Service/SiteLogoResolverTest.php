<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\SiteLogoResolver;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

#[CoversClass(SiteLogoResolver::class)]
final class SiteLogoResolverTest extends TestCase
{
    #[Test]
    public function resolveMailLogoReferencePrefersLanguageSmallLogo(): void
    {
        $resolver = new SiteLogoResolver($this->createMock(ResourceFactory::class));
        $site = $this->createMock(Site::class);
        $site->method('getConfiguration')->willReturn([
            'logoSmall' => 't3://file?uid=10',
            'logoBig' => 't3://file?uid=11',
        ]);
        $language = $this->createMock(SiteLanguage::class);
        $language->method('toArray')->willReturn([
            'logoSmall' => 't3://file?uid=1',
        ]);

        self::assertSame('t3://file?uid=1', $resolver->resolveMailLogoReference($site, $language));
    }

    #[Test]
    public function resolveMailLogoReferenceFallsBackToSiteBigLogo(): void
    {
        $resolver = new SiteLogoResolver($this->createMock(ResourceFactory::class));
        $site = $this->createMock(Site::class);
        $site->method('getConfiguration')->willReturn([
            'logoBig' => 't3://file?uid=22',
        ]);

        self::assertSame('t3://file?uid=22', $resolver->resolveMailLogoReference($site, null));
    }

    #[Test]
    public function resolvePublicFileUrlReturnsEmptyForInvalidReference(): void
    {
        $resolver = new SiteLogoResolver($this->createMock(ResourceFactory::class));
        $site = $this->createMock(Site::class);

        self::assertSame('', $resolver->resolvePublicFileUrl('', $site));
        self::assertSame('', $resolver->resolvePublicFileUrl('/fileadmin/logo.png', $site));
    }
}
