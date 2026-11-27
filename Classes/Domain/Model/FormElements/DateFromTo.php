<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Domain\Model\FormElements;

use Mpc\MpCore\Mvc\Validation\IsoDateFromToValidator;
use TYPO3\CMS\Form\Domain\Model\FormElements\AbstractFormElement;
use TYPO3\CMS\Form\Domain\Model\FormElements\ProcessableValueFormElementInterface;
use TYPO3\CMS\Form\Domain\Model\FormElements\StringableFormElementInterface;
use TYPO3\CMS\Form\Domain\Runtime\FormRuntime;

/**
 * Form element: native start/end date fields ({identifier}.start, {identifier}.end).
 *
 * @internal
 */
final class DateFromTo extends AbstractFormElement implements ProcessableValueFormElementInterface, StringableFormElementInterface
{
    public function initializeFormElement(): void
    {
        $min = trim((string)($this->properties['bootstrapDateMin'] ?? ''));
        $max = trim((string)($this->properties['bootstrapDateMax'] ?? ''));
        foreach ($this->getValidators() as $validator) {
            if (!$validator instanceof IsoDateFromToValidator) {
                continue;
            }
            $options = $validator->getOptions();
            $options['requireBothFields'] = $this->isRequired();
            if ($min !== '') {
                $options['minimum'] = $min;
            }
            if ($max !== '') {
                $options['maximum'] = $max;
            }
            $validator->setOptions($options);
        }
    }

    public function processElementValue(mixed $value, FormRuntime $formRuntime): mixed
    {
        if (!is_array($value)) {
            return $value;
        }

        return $this->valueToString($value);
    }

    public function valueToString(mixed $value): string
    {
        if (!is_array($value)) {
            return is_string($value) ? $value : '';
        }
        $startRaw = trim((string)($value['start'] ?? ''));
        $endRaw = trim((string)($value['end'] ?? ''));
        if ($startRaw === '' && $endRaw === '') {
            return '';
        }
        if ($startRaw === '' || $endRaw === '') {
            return trim($startRaw . ' – ' . $endRaw, ' –');
        }
        $displayFormat = (string)($this->properties['displayFormat'] ?? 'd.m.Y');
        try {
            $start = new \DateTimeImmutable($startRaw);
            $end = new \DateTimeImmutable($endRaw);
        } catch (\Exception) {
            return $startRaw . ' – ' . $endRaw;
        }

        return $start->format($displayFormat) . ' – ' . $end->format($displayFormat);
    }
}
