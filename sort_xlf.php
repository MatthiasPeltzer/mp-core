<?php
// sort_xlf.php
// Script to sort all <trans-unit> entries in XLF files by their id attribute.

$baseDir = __DIR__ . DIRECTORY_SEPARATOR . 'Resources' . DIRECTORY_SEPARATOR . 'Private' . DIRECTORY_SEPARATOR . 'Language';

if (!is_dir($baseDir)) {
    fwrite(STDERR, "Directory not found: $baseDir\n");
    exit(1);
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($baseDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

/** @var SplFileInfo $file */
foreach ($iterator as $file) {
    if ($file->isDir()) {
        continue;
    }

    $ext = strtolower($file->getExtension());
    if ($ext !== 'xlf' && $ext !== 'xliff') {
        continue;
    }

    $path = $file->getRealPath();
    if ($path === false) {
        continue;
    }

    $dom = new DOMDocument();
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;

    // Suppress warnings for malformed files but continue processing next files
    if (!$dom->load($path)) {
        fwrite(STDERR, "Warning: Could not parse XML file: $path\n");
        continue;
    }

    // Iterate over all <file> nodes (some XLFs may contain multiple)
    $fileNodes = $dom->getElementsByTagName('file');
    foreach ($fileNodes as $fileNode) {
        $bodyList = $fileNode->getElementsByTagName('body');
        foreach ($bodyList as $body) {
            // Collect <trans-unit> elements
            $transUnits = [];
            foreach (iterator_to_array($body->childNodes) as $child) {
                if ($child instanceof DOMElement && $child->tagName === 'trans-unit') {
                    $transUnits[] = $child;
                }
            }

            // Sort by id attribute
            usort($transUnits, static function (DOMElement $a, DOMElement $b) {
                return strcmp($a->getAttribute('id'), $b->getAttribute('id'));
            });

            // Remove existing <trans-unit> nodes
            foreach ($body->childNodes as $child) {
                if ($child instanceof DOMElement && $child->tagName === 'trans-unit') {
                    $body->removeChild($child);
                }
            }

            // Append sorted nodes
            foreach ($transUnits as $transUnit) {
                // Import node to ensure it's in the correct document
                $imported = $dom->importNode($transUnit, true);
                $body->appendChild($imported);
            }
        }
    }

    $dom->save($path);
    echo "Sorted: $path\n";
}

echo "Done.\n"; 