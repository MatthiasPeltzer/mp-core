<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Service;

use Mpc\MpCore\Service\DocumentationImportService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for the pure link/slug resolution helpers of
 * {@see DocumentationImportService}. These private methods have no dependency
 * on the injected ConnectionPool, so the service is instantiated without its
 * constructor and the methods are reached via reflection.
 */
#[CoversClass(DocumentationImportService::class)]
final class DocumentationImportServiceTest extends TestCase
{
    private DocumentationImportService $subject;

    protected function setUp(): void
    {
        parent::setUp();

        // DocumentationImportService is local-only tooling (gitignored) and is
        // absent from clean checkouts / CI. Skip rather than fatal in that case.
        if (!class_exists(DocumentationImportService::class)) {
            self::markTestSkipped('DocumentationImportService is not present in this checkout.');
        }

        $this->subject = (new \ReflectionClass(DocumentationImportService::class))
            ->newInstanceWithoutConstructor();
    }

    private function invoke(string $method, mixed ...$args): mixed
    {
        return (new \ReflectionMethod(DocumentationImportService::class, $method))
            ->invoke($this->subject, ...$args);
    }

    /**
     * @return array<string, array{0: string, 1: string, 2: string|null}>
     */
    public static function docHrefProvider(): array
    {
        return [
            'sibling file' => ['mp-core/index.html', 'installation.html', 'mp-core/installation.html'],
            'dot slash prefix' => ['mp-core/index.html', './usage.html', 'mp-core/usage.html'],
            'parent traversal to other package' => ['mp-core/index.html', '../mpc-rss/overview.html', 'mpc-rss/overview.html'],
            'appends html extension' => ['mp-core/index.html', 'guide', 'mp-core/guide.html'],
            'pure traversal resolves to null' => ['mp-core/index.html', '..', null],
        ];
    }

    #[Test]
    #[DataProvider('docHrefProvider')]
    public function resolvesRelativeDocumentationHref(string $currentKey, string $href, ?string $expected): void
    {
        self::assertSame($expected, $this->invoke('resolveDocHref', $currentKey, $href));
    }

    /**
     * @return array<string, array{0: string, 1: bool}>
     */
    public static function externalHrefProvider(): array
    {
        return [
            'https' => ['https://example.com', true],
            'http' => ['http://example.com', true],
            'mailto' => ['mailto:a@example.com', true],
            'tel' => ['tel:+123', true],
            'ftp' => ['ftp://example.com', true],
            'relative path' => ['/local/page', false],
            'relative file' => ['page.html', false],
        ];
    }

    #[Test]
    #[DataProvider('externalHrefProvider')]
    public function detectsExternalHref(string $href, bool $expected): void
    {
        self::assertSame($expected, $this->invoke('isExternalHref', $href));
    }

    #[Test]
    public function returnsUntouchedSlugWhenUnique(): void
    {
        self::assertSame('/docs/page', $this->invoke('ensureUniqueDocumentationSlug', '/docs/page', []));
    }

    #[Test]
    public function suffixesCollidingSlug(): void
    {
        $used = ['/docs/page' => '/docs/page'];

        self::assertSame('/docs/page-2', $this->invoke('ensureUniqueDocumentationSlug', '/docs/page', $used));
    }

    #[Test]
    public function findsNextFreeSuffixForRepeatedCollisions(): void
    {
        $used = [
            '/docs/page' => '/docs/page',
            '/docs/page-2' => '/docs/page-2',
        ];

        self::assertSame('/docs/page-3', $this->invoke('ensureUniqueDocumentationSlug', '/docs/page', $used));
    }

    #[Test]
    public function rewritesInternalLinksUsingUrlMap(): void
    {
        $html = '<a href="installation.html">Install</a>';
        $urlMap = ['mp-core/installation.html' => '/dokumentation/mp-core/installation'];

        $result = $this->invoke('rewriteLinks', $html, 'mp-core/index.html', $urlMap);

        self::assertStringContainsString('href="/dokumentation/mp-core/installation"', $result);
    }

    #[Test]
    public function leavesExternalAndAnchorLinksUntouched(): void
    {
        $html = '<a href="https://example.com">ext</a><a href="#section">anchor</a>';
        $urlMap = ['mp-core/installation.html' => '/dokumentation/mp-core/installation'];

        $result = $this->invoke('rewriteLinks', $html, 'mp-core/index.html', $urlMap);

        self::assertStringContainsString('href="https://example.com"', $result);
        self::assertStringContainsString('href="#section"', $result);
    }

    #[Test]
    public function leavesUnmappedInternalLinksUntouched(): void
    {
        $html = '<a href="unknown.html">x</a>';

        $result = $this->invoke('rewriteLinks', $html, 'mp-core/index.html', []);

        self::assertStringContainsString('href="unknown.html"', $result);
    }
}
