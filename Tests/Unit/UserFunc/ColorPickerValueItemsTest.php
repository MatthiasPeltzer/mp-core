<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Unit\UserFunc;

use Mpc\MpCore\UserFunc\ColorPickerValueItems;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Site\Entity\Site;

#[CoversClass(ColorPickerValueItems::class)]
final class ColorPickerValueItemsTest extends TestCase
{
    private ColorPickerValueItems $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new ColorPickerValueItems();
    }

    #[Test]
    public function getItemsReturnsEmptyListWhenSiteIsMissing(): void
    {
        $config = ['site' => null];

        $this->subject->getItems($config);

        self::assertSame([], $config['items']);
    }

    #[Test]
    public function getItemsFiltersInvalidColorsAndUsesCustomLabels(): void
    {
        $site = new Site('test', 1, [
            'color-1' => '#ff0000',
            'color-2' => 'javascript:alert(1)',
            'color-3' => '',
            'label-color-1' => 'Primary red',
            'not-color' => '#00ff00',
        ]);

        $config = ['site' => $site];
        $this->subject->getItems($config);

        self::assertCount(2, $config['items']);
        self::assertSame('', $config['items'][0]['value']);
        self::assertSame('color-1', $config['items'][1]['value']);
        self::assertSame('Primary red', $config['items'][1]['label']);
    }

    #[Test]
    public function getItemsSanitizesLongAndControlCharacterLabels(): void
    {
        $longLabel = str_repeat('A', 250);
        $site = new Site('test', 1, [
            'color-1' => '#336699',
            'label-color-1' => "Bad\x00label\n" . $longLabel,
        ]);

        $config = ['site' => $site];
        $this->subject->getItems($config);

        self::assertCount(2, $config['items']);
        $label = (string)$config['items'][1]['label'];
        self::assertStringNotContainsString("\0", $label);
        self::assertStringNotContainsString("\n", $label);
        self::assertLessThanOrEqual(200, mb_strlen($label));
        self::assertStringEndsWith('…', $label);
    }

    #[Test]
    public function getItemsFallsBackToColorValueWhenNoCustomLabelExists(): void
    {
        $site = new Site('test', 1, [
            'color-5' => 'cornflowerblue',
        ]);

        $config = ['site' => $site];
        $this->subject->getItems($config);

        self::assertCount(2, $config['items']);
        self::assertSame('color-5', $config['items'][1]['value']);
        self::assertSame('cornflowerblue', $config['items'][1]['label']);
    }
}
