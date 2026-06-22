#
# Table structure for table 'pages'
#
CREATE TABLE pages
(
	breadcrumb           tinyint(1) unsigned DEFAULT '0' NOT NULL,
	category_title       text,
	headercontainer      tinyint(1) unsigned DEFAULT '0' NOT NULL,
	highlight            tinyint(1) unsigned DEFAULT '0' NOT NULL,
	newsletter           tinyint(1) unsigned DEFAULT '0' NOT NULL,
	socialmedia          tinyint(1) unsigned DEFAULT '0' NOT NULL,
	teaser_description   text,
	link_icon            int unsigned        DEFAULT '0' NOT NULL,
	link_icon_background tinyint(1) unsigned DEFAULT '0' NOT NULL
);

#
# Table structure for table 'sys_file_metadata'
#
CREATE TABLE sys_file_metadata
(
	is_accessible tinyint(1) unsigned DEFAULT '0' NOT NULL
);

#
# Table structure for table 'sys_file_reference'
#
CREATE TABLE sys_file_reference
(
	allow_download tinyint(1) unsigned DEFAULT '0' NOT NULL,
	caption        varchar(1024)       DEFAULT ''  NOT NULL,
	outline        tinyint(1) unsigned DEFAULT '0' NOT NULL
);

#
# Table structure for table 'tt_content'
#
CREATE TABLE tt_content
(
	container_accordion_open       int(11) unsigned DEFAULT '1'  NOT NULL,
	container_accordion_faq_schema int(11) unsigned DEFAULT '0'  NOT NULL,
	container_accordion_toggle     int(11) unsigned DEFAULT '0'  NOT NULL,
	container_accordion_toggle_all int(11) unsigned DEFAULT '0'  NOT NULL,
	container_accordion_type       int(11) unsigned DEFAULT '1'  NOT NULL,
	container_headline             tinytext,
	container_tab_open             int(11) unsigned DEFAULT '1'  NOT NULL,
	gallery_columns                int(11) unsigned DEFAULT '1'  NOT NULL,
	gallery_layout                 tinytext,
	gallery_space_between          int(11) unsigned DEFAULT '10' NOT NULL,
	gallery_loop                   tinyint(1)       DEFAULT '0'  NOT NULL,
	gallery_speed                  int(11) unsigned DEFAULT '300' NOT NULL,
	gallery_autoplay_enabled       tinyint(1)       DEFAULT '0'  NOT NULL,
	gallery_autoplay_delay         int(11) unsigned DEFAULT '3000' NOT NULL,
	gallery_navigation_enabled     tinyint(1)       DEFAULT '1'  NOT NULL,
	gallery_pagination_enabled     tinyint(1)       DEFAULT '1'  NOT NULL,
	gallery_pagination_type        varchar(20)      DEFAULT 'bullets' NOT NULL,
	gallery_pagination_clickable   tinyint(1)       DEFAULT '1'  NOT NULL,
	gallery_pagination_dynamic_bullets tinyint(1)   DEFAULT '1'  NOT NULL,
	gallery_thumbs_per_view        int(11) unsigned DEFAULT '4'  NOT NULL,
	gallery_thumbs_space_between   int(11) unsigned DEFAULT '10' NOT NULL,
	grid_bgcolor                   varchar(10),
	grid_bgfullsize                tinyint(1)       DEFAULT '0'  NOT NULL,
	grid_bgimage                   int(11) unsigned DEFAULT '0'  NOT NULL,
	grid_columns                   tinytext,
	grid_breakpoint                varchar(3)       DEFAULT 'xl' NOT NULL,
	grid_col1                      varchar(2)       DEFAULT ''   NOT NULL,
	grid_col2                      varchar(2)       DEFAULT ''   NOT NULL,
	grid_col3                      varchar(2)       DEFAULT ''   NOT NULL,
	grid_col4                      varchar(2)       DEFAULT ''   NOT NULL,
	grid_offset1                   varchar(2)       DEFAULT ''   NOT NULL,
	grid_offset2                   varchar(2)       DEFAULT ''   NOT NULL,
	grid_offset3                   varchar(2)       DEFAULT ''   NOT NULL,
	grid_offset4                   varchar(2)       DEFAULT ''   NOT NULL,
	grid_gutter                    varchar(2)       DEFAULT ''   NOT NULL,
	grid_container                 tinyint(1)       DEFAULT '0'  NOT NULL,
	grid_icon                      int(11) unsigned DEFAULT '0'  NOT NULL,
	grid_icon_switch               tinyint(1)       DEFAULT '0'  NOT NULL,
	grid_light                     tinyint(1)       DEFAULT '0'  NOT NULL,
	grid_parallax                  tinyint(1)       DEFAULT '0'  NOT NULL,
	grid_type                      tinytext,
	header_kicker                  tinytext,
	header_subpages                tinytext,
	tx_header_inside               tinyint(1)       DEFAULT '0'  NOT NULL,
	tx_header_style                tinytext,
	tx_link                        tinytext,
	tx_link_layout                 tinytext,
	tx_link_position               tinytext,
	tx_link_switch                 tinyint(1)       DEFAULT '0'  NOT NULL,
	tx_link_text                   tinytext,
	slider_type                    tinytext,
	slider_slides_per_view         int(11) unsigned DEFAULT '1'  NOT NULL,
	slider_slides_per_group        int(11) unsigned DEFAULT '1'  NOT NULL,
	slider_space_between           int(11) unsigned DEFAULT '0'  NOT NULL,
	slider_loop                    tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_speed                   int(11) unsigned DEFAULT '300' NOT NULL,
	slider_autoplay_enabled        tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_autoplay_delay          int(11) unsigned DEFAULT '3000' NOT NULL,
	slider_autoplay_disable_on_interaction tinyint(1) DEFAULT '1' NOT NULL,
	slider_navigation_enabled      tinyint(1)       DEFAULT '1'  NOT NULL,
	slider_pagination_enabled      tinyint(1)       DEFAULT '1'  NOT NULL,
	slider_pagination_type         varchar(20)      DEFAULT 'bullets' NOT NULL,
	slider_pagination_clickable    tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_pagination_dynamic_bullets tinyint(1)    DEFAULT '0'  NOT NULL,
	slider_keyboard_enabled        tinyint(1)       DEFAULT '1'  NOT NULL,
	slider_mousewheel_enabled      tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_free_mode_enabled       tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_zoom_enabled            tinyint(1)       DEFAULT '0'  NOT NULL,
	slider_breakpoints             text,
	tx_stage_bg                    int(11)          DEFAULT '0'  NOT NULL,
	tx_stage_bgcolor               int(11)          DEFAULT '0'  NOT NULL,
	tx_stage_position              tinytext,
	tx_stage_switch                tinyint(1)       DEFAULT '0'  NOT NULL,
	tx_stage_video                 tinytext
);

#
# Table structure for table 'tx_mpcore_domain_model_webfontfamily'
#
CREATE TABLE tx_mpcore_domain_model_webfontfamily
(
	name         varchar(255)        DEFAULT ''     NOT NULL,
	fallback     varchar(255)        DEFAULT 'sans-serif' NOT NULL,
	role         varchar(16)         DEFAULT 'body' NOT NULL,
	css_variable varchar(64)         DEFAULT ''     NOT NULL,
	font_display varchar(16)         DEFAULT 'swap' NOT NULL,
	faces        int unsigned        DEFAULT '0'    NOT NULL
);

#
# Table structure for table 'tx_mpcore_domain_model_webfontface'
#
CREATE TABLE tx_mpcore_domain_model_webfontface
(
	parentid      int unsigned       DEFAULT '0'      NOT NULL,
	parenttable   varchar(255)       DEFAULT ''       NOT NULL,
	weight        varchar(8)         DEFAULT '400'    NOT NULL,
	font_style    varchar(16)        DEFAULT 'normal' NOT NULL,
	file          int unsigned       DEFAULT '0'      NOT NULL,
	unicode_range varchar(255)       DEFAULT ''       NOT NULL,

	KEY parent (parentid, parenttable)
);
