'use strict';

const Option = require('shipment').Option;

/*
 * With the --predictable-metafiles flag enabled, katapult will not append random strings to .build-info.json and .build-sum.json files
 */

module.exports = Option.createSimpleFlag('predictable-metafiles', 'Don\'t append random string to the filename of the generated meta files (unsafe)');