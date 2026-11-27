<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Tests\Unit\Mvc\Validation;

use Mpc\MpCore\Mvc\Validation\IsoDateFromToValidator;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class IsoDateFromToValidatorTest extends TestCase
{
    #[Test]
    public function acceptsOrderedRange(): void
    {
        $validator = new IsoDateFromToValidator();
        $validator->setOptions(['requireBothFields' => true]);
        $result = $validator->validate([
            'start' => '2026-06-10',
            'end' => '2026-06-18',
        ]);
        self::assertFalse($result->hasErrors());
    }

    #[Test]
    public function rejectsEndBeforeStart(): void
    {
        $validator = new IsoDateFromToValidator();
        $validator->setOptions(['requireBothFields' => true]);
        $result = $validator->validate([
            'start' => '2026-06-18',
            'end' => '2026-06-10',
        ]);
        self::assertTrue($result->hasErrors());
    }

    #[Test]
    public function requiresBothFieldsWhenConfigured(): void
    {
        $validator = new IsoDateFromToValidator();
        $validator->setOptions(['requireBothFields' => true]);
        $result = $validator->validate(['start' => '2026-06-10', 'end' => '']);
        self::assertTrue($result->hasErrors());
    }
}
