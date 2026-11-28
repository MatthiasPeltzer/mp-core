<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Functional\Support;

use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;

trait FunctionalSiteTrait
{
    protected function writeMinimalSiteConfiguration(
        string $identifier = 'mpcore',
        int $rootPageId = 1,
        string $websiteTitle = 'Acme Site',
        array $settingsYaml = [],
    ): void {
        $path = Environment::getConfigPath() . '/sites/' . $identifier;
        GeneralUtility::mkdir_deep($path);

        $settingsBlock = '';
        if ($settingsYaml !== []) {
            $settingsBlock = "settings:\n" . $this->yamlLines($settingsYaml, 1);
        }

        GeneralUtility::writeFile(
            $path . '/config.yaml',
            'rootPageId: ' . $rootPageId . "\n"
            . "base: 'http://localhost/'\n"
            . 'websiteTitle: ' . $this->yamlScalar($websiteTitle) . "\n"
            . "languages:\n"
            . "  - languageId: 0\n"
            . "    title: English\n"
            . "    base: /\n"
            . "    locale: en_US.UTF-8\n"
            . $settingsBlock,
        );
    }

    private function yamlScalar(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }
        if (is_int($value) || is_float($value)) {
            return (string)$value;
        }

        return "'" . str_replace("'", "''", (string)$value) . "'";
    }

    /**
     * @param array<string, mixed> $data
     */
    private function yamlLines(array $data, int $depth): string
    {
        $indent = str_repeat('  ', $depth);
        $lines = '';
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $lines .= $indent . $key . ":\n" . $this->yamlLines($value, $depth + 1);
                continue;
            }
            $lines .= $indent . $key . ': ' . $this->yamlScalar($value) . "\n";
        }

        return $lines;
    }
}
