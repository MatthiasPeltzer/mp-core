<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Mvc\Validation;

use TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator;

/**
 * Validates ext:form DateRange values: "Y-m-d,Y-m-d" (Bootstrap datepicker range submit format).
 */
final class IsoDateRangeStringValidator extends AbstractValidator
{
    private const string ISO_DATE_PATTERN = '/^\d{4}-\d{2}-\d{2}$/';

    /**
     * @var array<string, mixed>
     */
    protected $supportedOptions = [
        'minimum' => ['', 'Earliest allowed calendar date (Y-m-d) for either bound of the range.', 'string'],
        'maximum' => ['', 'Latest allowed calendar date (Y-m-d) for either bound of the range.', 'string'],
    ];

    protected function isValid(mixed $value): void
    {
        if ($value === null || $value === '') {
            return;
        }
        if (!is_string($value)) {
            $this->addError('The submitted value must be a date range string.', 1732430001);
            return;
        }

        $value = trim($value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/', $value)) {
            $this->addError('The date range must contain two ISO dates separated by a comma.', 1732430002);
            return;
        }

        [$startRaw, $endRaw] = explode(',', $value, 2);
        $start = $this->parseIsoDate($startRaw);
        $end = $this->parseIsoDate($endRaw);
        if ($start === null || $end === null) {
            $this->addError('The date range contains invalid calendar dates.', 1732430003);
            return;
        }
        if ($start > $end) {
            $this->addError('The range end must not be before the start date.', 1732430004);
            return;
        }

        $minimum = $this->parseBoundOption($this->options['minimum'] ?? '');
        $maximum = $this->parseBoundOption($this->options['maximum'] ?? '');
        if ($minimum !== null && ($start < $minimum || $end < $minimum)) {
            $this->addError(
                'The date range must not begin before ' . $minimum->format('Y-m-d') . '.',
                1732430005,
                [$minimum->format('Y-m-d')]
            );
        }
        if ($maximum !== null && ($start > $maximum || $end > $maximum)) {
            $this->addError(
                'The date range must not end after ' . $maximum->format('Y-m-d') . '.',
                1732430006,
                [$maximum->format('Y-m-d')]
            );
        }
    }

    private function parseIsoDate(string $isoDate): ?\DateTimeImmutable
    {
        if (!preg_match(self::ISO_DATE_PATTERN, $isoDate)) {
            return null;
        }
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $isoDate);
        if ($date === false) {
            return null;
        }
        $errors = \DateTimeImmutable::getLastErrors();
        if (is_array($errors) && ($errors['warning_count'] > 0 || $errors['error_count'] > 0)) {
            return null;
        }

        return $date;
    }

    private function parseBoundOption(string $option): ?\DateTimeImmutable
    {
        $option = trim($option);
        if ($option === '') {
            return null;
        }

        return $this->parseIsoDate($option);
    }
}
