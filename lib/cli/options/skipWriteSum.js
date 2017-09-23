'use strict';

const Option = require('shipment').Option;

/*
 * With the --skip-write-sum flag enabled, katapult will not run "write-sum" as a part of the "package" routine
 */

module.exports = Option.createSimpleFlag('skip-write-sum', 'Skip "write-sum" in "package" routine');