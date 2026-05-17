<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') or die('Access denied.');

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

$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:mp_core/Configuration/RTE/Default.yaml';
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['mp_core_backend'] = 'EXT:mp_core/Resources/Public/StyleSheets/backend.css';
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['mp_core_ckeditor'] = 'EXT:mp_core/Resources/Public/StyleSheets/ckeditor.css';