<?php

declare(strict_types=1);

/**
 * Syntax-check every tracked PHP file in the extension (excludes .Build and vendor).
 */
$root = dirname(__DIR__, 2);
$exit = 0;

$process = proc_open(
    ['git', 'ls-files', '*.php'],
    [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ],
    $pipes,
    $root,
);

if (!is_resource($process)) {
    fwrite(STDERR, 'Failed to run git ls-files' . PHP_EOL);
    exit(1);
}

fclose($pipes[0]);
$listed = stream_get_contents($pipes[1]);
$gitErr = stream_get_contents($pipes[2]);
fclose($pipes[1]);
fclose($pipes[2]);
$status = proc_close($process);

if ($status !== 0) {
    fwrite(STDERR, trim($gitErr !== false ? $gitErr : 'git ls-files failed') . PHP_EOL);
    exit(1);
}

foreach (explode("\n", trim($listed !== false ? $listed : '')) as $relative) {
    if ($relative === '') {
        continue;
    }
    $file = $root . '/' . $relative;
    if (!is_file($file)) {
        continue;
    }
    $output = [];
    exec('php -l ' . escapeshellarg($file) . ' 2>&1', $output, $code);
    if ($code !== 0) {
        fwrite(STDERR, implode(PHP_EOL, $output) . PHP_EOL);
        $exit = 1;
    }
}

exit($exit);
