'use strict';

const Option = require('shipment').Option;

/*
 * With the --disable-cache flag enabled, katapult will not use cached files or cache the results of file operations
 */

module.exports = Option.createSimpleFlag('disable-cache', 'Disable caching', 'd');