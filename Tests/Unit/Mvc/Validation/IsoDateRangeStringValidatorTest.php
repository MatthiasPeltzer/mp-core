<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Tests\Unit\Mvc\Validation;

use Mpc\MpCore\Mvc\Validation\IsoDateRangeStringValidator;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class IsoDateRangeStringValidatorTest extends TestCase
{
    #[Test]
    public function acceptsEmptyValue(): void
    {
        $validator = new IsoDateRangeStringValidator();
        self::assertFalse($validator->validate(null)->hasErrors());
        self::assertFalse($validator->validate('')->hasErrors());
    }

    #[Test]
    public function acceptsValidRange(): void
    {
        $validator = new IsoDateRangeStringValidator();
        $result = $validator->validate('2026-06-10,2026-06-18');
        self::assertFalse($result->hasErrors());
    }

    #[Test]
    public function rejectsReversedRange(): void
    {
        $validator = new IsoDateRangeStringValidator();
        $result = $validator->validate('2026-06-18,2026-06-10');
        self::assertTrue($result->hasErrors());
    }

    #[Test]
    public function rejectsInvalidFormat(): void
    {
        $validator = new IsoDateRangeStringValidator();
        $result = $validator->validate('10.06.2026,18.06.2026');
        self::assertTrue($result->hasErrors());
    }

    #[Test]
    public function respectsMinimumBound(): void
    {
        $validator = new IsoDateRangeStringValidator();
        $validator->setOptions(['minimum' => '2026-06-01']);
        $result = $validator->validate('2026-05-20,2026-06-05');
        self::assertTrue($result->hasErrors());
    }
}
