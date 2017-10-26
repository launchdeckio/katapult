'use strict';

const Shipment       = require('shipment');
const AgentInterface = require('./lib/io/AgentInterface');

module.exports = (new Shipment(require('./lib/actions'))).api();

module.exports.AgentInterface = AgentInterface;