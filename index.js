'use strict';

const Shipment = require('shipment');

module.exports = (new Shipment(require('./lib/actions'))).api();