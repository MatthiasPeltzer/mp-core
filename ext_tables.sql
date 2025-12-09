#
# Table structure for table 'pages'
#
CREATE TABLE pages
(
	breadcrumb         tinyint(1) unsigned DEFAULT '0' NOT NULL,
	category_title     text,
	headercontainer    tinyint(1) unsigned DEFAULT '0' NOT NULL,
	highlight          tinyint(1) unsigned DEFAULT '0' NOT NULL,
	newsletter         tinyint(1) unsigned DEFAULT '0' NOT NULL,
	socialmedia        tinyint(1) unsigned DEFAULT '0' NOT NULL,
	teaser_description text
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
	allow_download   tinyint(1) unsigned DEFAULT '0' NOT NULL,
	caption          varchar(1024)       DEFAULT ''  NOT NULL,
	longdesc         varchar(1024)       DEFAULT ''  NOT NULL,
	outline          tinyint(1) unsigned DEFAULT '0' NOT NULL
);

#
# Table structure for table 'tt_content'
#
CREATE TABLE tt_content
(
	# Container fields
	container_accordion_open       int(11) unsigned DEFAULT '1' NOT NULL,
	container_accordion_toggle     int(11) unsigned DEFAULT '0' NOT NULL,
	container_accordion_toggle_all int(11) unsigned DEFAULT '0' NOT NULL,
	container_accordion_type       int(11) unsigned DEFAULT '1' NOT NULL,
	container_headline             tinytext,
	container_tab_open             int(11) unsigned DEFAULT '1' NOT NULL,

	# Gallery fields
	gallery_columns int(11) unsigned DEFAULT '1' NOT NULL,
	gallery_layout  tinytext,

	# Grid fields
	grid_bgcolor      varchar(10),
	grid_bgfullsize   tinyint(1)       DEFAULT '0' NOT NULL,
	grid_bgimage      int(11) unsigned DEFAULT '0' NOT NULL,
	grid_bottom_image tinytext,
	grid_columns      tinytext,
	grid_container    tinyint(1)       DEFAULT '0' NOT NULL,
	grid_icon         int(11) unsigned DEFAULT '0' NOT NULL,
	grid_icon_switch  tinyint(1)       DEFAULT '0' NOT NULL,
	grid_light        tinyint(1)       DEFAULT '0' NOT NULL,
	grid_parallax     tinyint(1)       DEFAULT '0' NOT NULL,
	grid_type         tinytext,

	# Header fields
	header_kicker    tinytext,
	header_subpages  tinytext,
	tx_header_inside tinyint(1) DEFAULT '0' NOT NULL,
	tx_header_style  tinytext,

	# Link fields
	tx_link          tinytext,
	tx_link_layout   tinytext,
	tx_link_position tinytext,
	tx_link_switch   tinyint(1) DEFAULT '0' NOT NULL,
	tx_link_text     tinytext,

	# Slider fields
	slider         tinyint(1) DEFAULT '0' NOT NULL,
	slider_columns tinytext,
	slider_type    tinytext,

	# Stage fields
	tx_stage_bg         int(11)          DEFAULT '0' NOT NULL,
	tx_stage_bgcolor    int(11)          DEFAULT '0' NOT NULL,
	tx_stage_image      int(11) unsigned DEFAULT '0' NOT NULL,
	tx_stage_position   tinytext,
	tx_stage_salutation int(11)          DEFAULT '0' NOT NULL,
	tx_stage_switch     tinyint(1)       DEFAULT '0' NOT NULL,
	tx_stage_video      tinytext,

	# Banner fields
	tx_banner_image int(11) unsigned DEFAULT '0' NOT NULL
);
