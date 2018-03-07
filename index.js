'use strict';

const {api} = require('shipment');

module.exports = api(require('./lib/actions'));

module.exports.AgentInterface = require('./lib/io/AgentInterface');