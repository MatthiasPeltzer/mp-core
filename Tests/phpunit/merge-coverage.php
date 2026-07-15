<?php

declare(strict_types=1);

/**
 * Merges the PHP coverage exports produced by the unit and functional suites
 * into a single report.
 *
 * The two suites run in separate PHPUnit processes (different configs), so each
 * writes its own serialized {@see \SebastianBergmann\CodeCoverage\CodeCoverage}
 * object via `--coverage-php`. This script merges them and prints a combined
 * text summary plus an HTML report under `.Build/coverage/html`.
 *
 * Usage (see composer script `test:coverage:merged`):
 *   php Tests/phpunit/merge-coverage.php
 */

use SebastianBergmann\CodeCoverage\CodeCoverage;
use SebastianBergmann\CodeCoverage\Report\Html\Facade as HtmlFacade;
use SebastianBergmann\CodeCoverage\Report\Text as TextReport;
use SebastianBergmann\CodeCoverage\Report\Thresholds;

$root = dirname(__DIR__, 2);
require $root . '/.Build/vendor/autoload.php';

$coverageDir = $root . '/.Build/coverage';
$unitFile = $coverageDir . '/unit.cov';
$functionalFile = $coverageDir . '/functional.cov';

$parts = [];
foreach (['unit' => $unitFile, 'functional' => $functionalFile] as $label => $file) {
    if (is_file($file)) {
        $parts[$label] = $file;
    } else {
        fwrite(STDERR, "warning: missing coverage export for {$label} suite ({$file})\n");
    }
}

if ($parts === []) {
    fwrite(STDERR, "error: no coverage exports found; run the suites with --coverage-php first.\n");
    exit(1);
}

$merged = null;
foreach ($parts as $file) {
    /** @var CodeCoverage $coverage */
    $coverage = require $file;
    if (!$coverage instanceof CodeCoverage) {
        fwrite(STDERR, "error: {$file} did not return a CodeCoverage object.\n");
        exit(1);
    }
    if ($merged === null) {
        $merged = $coverage;
        continue;
    }
    $merged->merge($coverage);
}

$htmlTarget = $coverageDir . '/html';
(new HtmlFacade())->process($merged, $htmlTarget);

echo (new TextReport(Thresholds::default(), false, false))->process($merged, false);
echo "\nCombined suites: " . implode(' + ', array_keys($parts)) . "\n";
echo 'HTML report: ' . $htmlTarget . "/index.html\n";
