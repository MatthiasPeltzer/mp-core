<?php

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die('Access denied.');

/***************
 * Define TypoScript as content rendering template
 */
$GLOBALS['TYPO3_CONF_VARS']['FE']['contentRenderingTemplates'][] = 'mp_core/Configuration/TypoScript/';
$GLOBALS['TYPO3_CONF_VARS']['FE']['contentRenderingTemplates'][] = 'mp_core/Configuration/TypoScript/ContentElement/';

/***************
 * Register custom EXT:form configuration
 */
if (ExtensionManagementUtility::isLoaded('form')) {
    ExtensionManagementUtility::addTypoScriptSetup(trim('
        module.tx_form {
            settings {
                yamlConfigurations {
                    110 = EXT:mp_core/Resources/Extensions/form/Yaml/BaseSetup.yaml
                }
            }
        }
        plugin.tx_form {
            settings {
                yamlConfigurations {
                    110 = EXT:mp_core/Resources/Extensions/form/Yaml/BaseSetup.yaml
                }
            }
        }
    '));
}

/***************
 * Add default RTE and RTE/Backend CSS configuration for the template package
 */
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:mp_core/Configuration/RTE/Default.yaml';
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['mp_core'] = 'EXT:mp_core/Resources/Public/StyleSheets/backend.css';
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['mp_core'] = 'EXT:mp_core/Resources/Public/StyleSheets/ckeditor.css';
