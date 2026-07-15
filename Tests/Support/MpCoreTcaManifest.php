<?php

declare(strict_types=1);

namespace Mpc\MpCore\Tests\Support;

use Mpc\MpCore\Preview\CustomContentPreviewRenderer;
use Mpc\MpCore\UserFunc\ColorPickerValueItems;

/**
 * Single source of truth for mp-core TCA expectations used by configuration tests.
 */
final class MpCoreTcaManifest
{
    /**
     * Extensions required to load mp-core TCA without bootstrap errors.
     *
     * @var list<string>
     */
    public const FUNCTIONAL_TEST_EXTENSIONS = [
        'b13/container',
        'friendsoftypo3/content-blocks',
        'mpc/mp-core',
    ];

    /**
     * @var list<string>
     */
    public const CORE_EXTENSIONS_TO_LOAD = ['rte_ckeditor', 'seo'];

    /**
     * @var list<string>
     */
    public const CUSTOM_TABLES = [
        'tx_mpcore_domain_model_webfontfamily',
        'tx_mpcore_domain_model_webfontface',
    ];

    /**
     * CTypes registered by mp-core (plain + b13/container).
     *
     * @var list<string>
     */
    public const C_TYPES = [
        'gallery',
        'singleteaser',
        'banner',
        'mpcore_todolist',
        'stage',
        'ce_container',
        'ce_slider',
        'ce_modal',
        'ce_grid',
        'ce_accordion',
        'ce_tabs',
    ];

    /**
     * CTypes for which mp-core sets a dedicated typeicon_classes entry.
     *
     * @var array<string, string>
     */
    public const C_TYPE_ICONS = [
        'gallery' => 'tx_gallery',
        'singleteaser' => 'tx_singleteaser',
        'banner' => 'tx_banner',
        'mpcore_todolist' => 'typo3-vite-demo-todolist',
        'stage' => 'tx_stage',
    ];

    /**
     * Core tables mp-core overrides (smoke columns prove overrides loaded).
     *
     * @var array<string, list<string>>
     */
    public const OVERRIDDEN_CORE_TABLE_COLUMNS = [
        'tt_content' => ['grid_bgcolor', 'tx_link_action', 'tx_header_inside'],
        'pages' => ['newsletter', 'socialmedia', 'breadcrumb', 'mainCategory'],
        'sys_category' => [],
        'sys_file_metadata' => ['is_accessible'],
        'sys_file_reference' => ['outline', 'allow_download'],
        'sys_template' => [],
    ];

    /**
     * tt_content types mp-core customizes without registering a new CType.
     *
     * @var list<string>
     */
    public const OVERRIDDEN_TT_CONTENT_TYPES = [
        'menu_subpages',
    ];

    /**
     * Tables whose merged TCA schema must build without exception.
     *
     * @var list<string>
     */
    public const SCHEMA_TABLES = [
        'tt_content',
        'tx_mpcore_domain_model_webfontfamily',
        'tx_mpcore_domain_model_webfontface',
    ];

    public const PREVIEW_RENDERER_CLASS = CustomContentPreviewRenderer::class;

    public const COLOR_PICKER_ITEMS_PROC_CLASS = ColorPickerValueItems::class;
}
