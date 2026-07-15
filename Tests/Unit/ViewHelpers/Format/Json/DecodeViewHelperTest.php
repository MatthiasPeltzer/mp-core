<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\ViewHelpers\Format\Json;

use Mpc\MpCore\ViewHelpers\Format\Json\DecodeViewHelper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3Fluid\Fluid\Core\ViewHelper\Exception;

#[CoversClass(DecodeViewHelper::class)]
final class DecodeViewHelperTest extends TestCase
{
    private function render(string $json): mixed
    {
        $viewHelper = new DecodeViewHelper();
        $viewHelper->setArguments(['json' => $json]);

        return $viewHelper->render();
    }

    #[Test]
    public function decodesJsonObjectToArray(): void
    {
        self::assertSame(['a' => 1, 'b' => ['c' => true]], $this->render('{"a":1,"b":{"c":true}}'));
    }

    #[Test]
    public function decodesJsonArray(): void
    {
        self::assertSame([1, 2, 3], $this->render('[1,2,3]'));
    }

    #[Test]
    public function returnsEmptyArrayForEmptyString(): void
    {
        self::assertSame([], $this->render(''));
    }

    #[Test]
    public function returnsEmptyArrayForNull(): void
    {
        $viewHelper = new DecodeViewHelper();
        $viewHelper->setArguments(['json' => null]);

        self::assertSame([], $viewHelper->render());
    }

    #[Test]
    public function throwsFluidExceptionForInvalidJson(): void
    {
        $this->expectException(Exception::class);
        $this->render('{not valid');
    }
}
