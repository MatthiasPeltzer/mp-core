<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Domain\Model\FormElements;

use Mpc\MpCore\Mvc\Validation\IsoDateRangeStringValidator;
use TYPO3\CMS\Form\Domain\Model\FormElements\AbstractFormElement;
use TYPO3\CMS\Form\Domain\Model\FormElements\StringableFormElementInterface;

/**
 * Form element value: comma-separated ISO dates (Y-m-d,Y-m-d) from BS6 ranged datepicker.
 *
 * @internal
 */
final class DateRange extends AbstractFormElement implements StringableFormElementInterface
{
    public function initializeFormElement(): void
    {
        $min = trim((string)($this->properties['bootstrapDateMin'] ?? ''));
        $max = trim((string)($this->properties['bootstrapDateMax'] ?? ''));
        if ($min === '' && $max === '') {
            return;
        }
        foreach ($this->getValidators() as $validator) {
            if (!$validator instanceof IsoDateRangeStringValidator) {
                continue;
            }
            $options = $validator->getOptions();
            if ($min !== '') {
                $options['minimum'] = $min;
            }
            if ($max !== '') {
                $options['maximum'] = $max;
            }
            $validator->setOptions($options);
        }
    }

    public function valueToString(mixed $value): string
    {
        if (!is_string($value) || trim($value) === '') {
            return '';
        }
        $parts = array_map(trim(...), explode(',', $value, 2));
        if (count($parts) !== 2) {
            return $value;
        }
        $displayFormat = (string)($this->properties['displayFormat'] ?? 'd.m.Y');
        try {
            $start = new \DateTimeImmutable($parts[0]);
            $end = new \DateTimeImmutable($parts[1]);
        } catch (\Exception) {
            return $value;
        }

        return $start->format($displayFormat) . ' – ' . $end->format($displayFormat);
    }
}
