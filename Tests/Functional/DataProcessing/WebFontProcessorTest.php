<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\DataProcessing;

use Mpc\MpCore\DataProcessing\WebFontProcessor;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceStorage;
use TYPO3\CMS\Core\Resource\StorageRepository;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

/**
 * Functional test for {@see WebFontProcessor}: exercises the real QueryBuilder /
 * FAL resolution path against a database with the extension's schema installed.
 * This is the sample that proves the functional-test harness works end to end.
 */
final class WebFontProcessorTest extends FunctionalTestCase
{
    private const FAMILY_TABLE = 'tx_mpcore_domain_model_webfontfamily';
    private const FACE_TABLE = 'tx_mpcore_domain_model_webfontface';

    /**
     * mp_core's ext_emconf declares hard dependencies on these system extensions.
     */
    protected array $coreExtensionsToLoad = ['rte_ckeditor', 'seo'];

    /**
     * mp_core's TCA overrides reference b13/container and content_blocks APIs at
     * load time, so those packages must be present even though ext_emconf only
     * lists the system-extension dependencies above.
     */
    protected array $testExtensionsToLoad = [
        'b13/container',
        'friendsoftypo3/content-blocks',
        'mpc/mp-core',
    ];

    private WebFontProcessor $subject;
    private ResourceStorage $storage;

    protected function setUp(): void
    {
        parent::setUp();

        $fileadmin = Environment::getPublicPath() . '/fileadmin';
        GeneralUtility::mkdir_deep($fileadmin);

        $storageRepository = GeneralUtility::makeInstance(StorageRepository::class);
        $storageId = $storageRepository->createLocalStorage('Test', 'fileadmin/', 'relative', 'Test storage', true);
        $storage = $storageRepository->findByUid($storageId);
        self::assertInstanceOf(ResourceStorage::class, $storage);
        $storage->setEvaluatePermissions(false);
        $this->storage = $storage;

        $this->subject = GeneralUtility::makeInstance(WebFontProcessor::class);
    }

    private function site(): Site
    {
        return new Site('test-site', 1, [
            'base' => 'https://example.com/',
            'languages' => [[
                'languageId' => 0,
                'title' => 'English',
                'locale' => 'en_US.UTF-8',
                'base' => '/',
            ]],
        ]);
    }

    private function contentObjectRenderer(): ContentObjectRenderer
    {
        return GeneralUtility::makeInstance(ContentObjectRenderer::class);
    }

    #[Test]
    public function returnsEmptyCssWhenNoFontsConfigured(): void
    {
        $result = $this->subject->process(
            $this->contentObjectRenderer(),
            [],
            [],
            ['site' => $this->site()]
        );

        self::assertSame('', $result['webFontsCss']);
    }

    #[Test]
    public function buildsCssForConfiguredFontFamily(): void
    {
        $connectionPool = GeneralUtility::makeInstance(ConnectionPool::class);
        $connectionPool->getConnectionForTable(self::FAMILY_TABLE)->insert(self::FAMILY_TABLE, [
            'uid' => 1,
            'pid' => 1,
            'name' => 'Inter',
            'fallback' => 'sans-serif',
            'role' => 'body',
            'css_variable' => '',
            'font_display' => 'swap',
        ]);
        $connectionPool->getConnectionForTable(self::FACE_TABLE)->insert(self::FACE_TABLE, [
            'uid' => 1,
            'pid' => 1,
            'parentid' => 1,
            'parenttable' => self::FAMILY_TABLE,
            'weight' => '400',
            'font_style' => 'normal',
            'unicode_range' => '',
        ]);
        $this->attachFontFile(1, 'inter.woff2', 'fake-woff2-bytes');

        $result = $this->subject->process(
            $this->contentObjectRenderer(),
            [],
            [],
            ['site' => $this->site()]
        );

        $css = $result['webFontsCss'];
        self::assertStringContainsString('@font-face', $css);
        self::assertStringContainsString('font-family: "Inter"', $css);
        self::assertStringContainsString('inter.woff2', $css);
        self::assertStringContainsString('format("woff2")', $css);
        // body role maps onto the Bootstrap body font custom property.
        self::assertStringContainsString('--bs-body-font-family', $css);
    }

    private function attachFontFile(int $faceUid, string $fileName, string $contents): void
    {
        $file = $this->storage->createFile($fileName, $this->storage->getRootLevelFolder());
        $file->setContents($contents);

        GeneralUtility::makeInstance(ConnectionPool::class)
            ->getConnectionForTable('sys_file_reference')
            ->insert('sys_file_reference', [
                'pid' => 1,
                'tablenames' => self::FACE_TABLE,
                'fieldname' => 'file',
                'uid_local' => $file->getUid(),
                'uid_foreign' => $faceUid,
                'sorting_foreign' => 1,
            ]);
    }
}
