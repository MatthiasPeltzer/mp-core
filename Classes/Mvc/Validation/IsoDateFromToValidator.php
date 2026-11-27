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
 * Validates ext:form DateFromTo values: array with ISO start and end (Y-m-d).
 */
final class IsoDateFromToValidator extends AbstractValidator
{
    private const string ISO_DATE_PATTERN = '/^\d{4}-\d{2}-\d{2}$/';

    /**
     * @var array<string, mixed>
     */
    protected $supportedOptions = [
        'minimum' => ['', 'Earliest allowed calendar date (Y-m-d) for either bound.', 'string'],
        'maximum' => ['', 'Latest allowed calendar date (Y-m-d) for either bound.', 'string'],
        'requireBothFields' => [false, 'When true, both start and end must be set.', 'boolean'],
    ];

    protected function isValid(mixed $value): void
    {
        if ($value === null || $value === '') {
            if ($this->options['requireBothFields'] ?? false) {
                $this->addError('Please enter both a start date and an end date.', 1732440001);
            }

            return;
        }
        if (!is_array($value)) {
            $this->addError('The submitted value must contain start and end dates.', 1732440002);

            return;
        }

        $startRaw = trim((string)($value['start'] ?? ''));
        $endRaw = trim((string)($value['end'] ?? ''));
        if ($startRaw === '' && $endRaw === '') {
            if ($this->options['requireBothFields'] ?? false) {
                $this->addError('Please enter both a start date and an end date.', 1732440001);
            }

            return;
        }
        if ($this->options['requireBothFields'] ?? false) {
            if ($startRaw === '' || $endRaw === '') {
                $this->addError('Please enter both a start date and an end date.', 1732440003);

                return;
            }
        }
        if ($startRaw !== '' && $this->parseIsoDate($startRaw) === null) {
            $this->addError('The start date is invalid.', 1732440004);

            return;
        }
        if ($endRaw !== '' && $this->parseIsoDate($endRaw) === null) {
            $this->addError('The end date is invalid.', 1732440005);

            return;
        }
        if ($startRaw === '' || $endRaw === '') {
            return;
        }

        $start = $this->parseIsoDate($startRaw);
        $end = $this->parseIsoDate($endRaw);
        if ($start === null || $end === null) {
            return;
        }
        if ($start > $end) {
            $this->addError('The end date must not be before the start date.', 1732440006);

            return;
        }

        $minimum = $this->parseBoundOption($this->options['minimum'] ?? '');
        $maximum = $this->parseBoundOption($this->options['maximum'] ?? '');
        if ($minimum !== null && ($start < $minimum || $end < $minimum)) {
            $this->addError(
                'The dates must not be before ' . $minimum->format('Y-m-d') . '.',
                1732440007,
                [$minimum->format('Y-m-d')]
            );
        }
        if ($maximum !== null && ($start > $maximum || $end > $maximum)) {
            $this->addError(
                'The dates must not be after ' . $maximum->format('Y-m-d') . '.',
                1732440008,
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
