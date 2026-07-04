<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\Exception;

use Mpc\MpCore\Exception\FileException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(FileException::class)]
final class FileExceptionTest extends TestCase
{
    #[Test]
    public function exposesMessageCodeAndContext(): void
    {
        $context = ['path' => '/tmp/x', 'reason' => 'missing'];
        $exception = new FileException('boom', 1234, $context);

        self::assertSame('boom', $exception->getMessage());
        self::assertSame(1234, $exception->getCode());
        self::assertSame($context, $exception->getContext());
    }

    #[Test]
    public function contextDefaultsToEmptyArray(): void
    {
        $exception = new FileException('boom');

        self::assertSame([], $exception->getContext());
    }

    #[Test]
    public function propagatesPreviousThrowable(): void
    {
        $previous = new \RuntimeException('cause');
        $exception = new FileException('boom', 0, [], $previous);

        self::assertSame($previous, $exception->getPrevious());
    }
}
