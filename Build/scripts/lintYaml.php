<?php

declare(strict_types=1);

/**
 * Lint every tracked YAML file with the Symfony yaml-lint binary.
 */
$root = dirname(__DIR__, 2);
$lintBin = $root . '/.Build/bin/yaml-lint';
if (!is_file($lintBin)) {
    fwrite(STDERR, 'Missing .Build/bin/yaml-lint — run composer install in the package.' . PHP_EOL);
    exit(1);
}

$process = proc_open(
    ['git', 'ls-files', '*.yaml', '*.yml'],
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

$files = array_values(array_filter(explode("\n", trim($listed !== false ? $listed : ''))));
if ($files === []) {
    echo 'YAML lint OK (no files)' . PHP_EOL;
    exit(0);
}

$command = array_merge([PHP_BINARY, $lintBin, '--parse-tags'], array_map(
    static fn (string $relative): string => $root . '/' . $relative,
    $files,
));

$lint = proc_open(
    $command,
    [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ],
    $lintPipes,
    $root,
);

if (!is_resource($lint)) {
    fwrite(STDERR, 'Failed to run yaml-lint' . PHP_EOL);
    exit(1);
}

fclose($lintPipes[0]);
$out = stream_get_contents($lintPipes[1]);
$err = stream_get_contents($lintPipes[2]);
fclose($lintPipes[1]);
fclose($lintPipes[2]);
$lintStatus = proc_close($lint);

if ($out !== false && $out !== '') {
    echo $out;
}
if ($err !== false && $err !== '') {
    fwrite(STDERR, $err);
}

exit($lintStatus);
