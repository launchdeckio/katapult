'use strict';

const Option = require('shipment').Option;

/*
 * With the --no-random flag enabled, katapult will not append random strings to .build-info.json and .build-sum.json files
 */

module.exports = Option.createSimpleFlag('clean-metafiles', 'Don\'t append random string to the filename of the generated meta files (unsafe)');