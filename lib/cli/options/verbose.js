'use strict';

const Option = require('shipment').Option;

module.exports = Option.createSimpleFlag('verbosity', 'Extra chatty mode', 'v', true);