'use strict';

const Option = require('shipment').Option;

/*
 * With the --skip-read-sum flag enabled, katapult will not run "read-sum" as a part of the "package" routine
 */

module.exports = Option.createSimpleFlag('skip-read-sum', 'Skip "read-sum" in "package" routine');