#!/usr/bin/env node
'use strict';

const Shipment = require('shipment');
const pkg      = require('./../package.json');
const actions  = require('./../lib/actions');

(new Shipment(actions, {pkg})).cli();