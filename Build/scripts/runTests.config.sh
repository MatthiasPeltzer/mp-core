#!/usr/bin/env bash
# Package-specific settings for Build/scripts/runTests.sh (mp-core).

NETWORK_PREFIX="mp-core"
COMPOSER_ROOT_VERSION="${COMPOSER_ROOT_VERSION:-1.2.16-dev}"
UNIT_PHPUNIT_CONFIG="phpunit.xml.dist"
FUNCTIONAL_PHPUNIT_CONFIG="Tests/phpunit/FunctionalTests.xml"
PHPSTAN_CONFIG="phpstan.neon.dist"
PHP_CS_FIXER_CONFIG=".php-cs-fixer.dist.php"
SQLITE_TMPFS_DIR=".Build/Public/typo3temp/var/tests/functional-sqlite-dbs"
WEB_PUBLIC_DIR=".Build/Public"
ENABLE_ACCEPTANCE=1
ENABLE_JS_UNIT=1
ENABLE_FRONTEND_LINT=1
FRONTEND_BUILD_DIR="Build"
