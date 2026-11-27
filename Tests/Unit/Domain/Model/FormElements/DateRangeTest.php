<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Tests\Unit\Domain\Model\FormElements;

use Mpc\MpCore\Domain\Model\FormElements\DateRange;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Form\Domain\Runtime\FormRuntime;

final class DateRangeTest extends TestCase
{
    #[Test]
    public function valueToStringFormatsDisplayRange(): void
    {
        $element = new DateRange('travel', 'DateRange');
        $element->setProperty('displayFormat', 'd.m.Y');
        self::assertSame('10.06.2026 – 18.06.2026', $element->valueToString('2026-06-10,2026-06-18'));
    }

    #[Test]
    public function processElementValueFormatsForMailAndSummary(): void
    {
        $element = new DateRange('travel', 'DateRange');
        $element->setProperty('displayFormat', 'd.m.Y');
        $runtime = $this->createMock(FormRuntime::class);
        self::assertSame(
            '10.06.2026 – 18.06.2026',
            $element->processElementValue('2026-06-10,2026-06-18', $runtime)
        );
    }
}
