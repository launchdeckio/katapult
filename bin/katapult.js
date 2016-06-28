#!/usr/bin/env node
'use strict';

const cli     = require('shipment').cli;
const pkg     = require('./../package.json');
const actions = require('./../lib/actions');

cli(actions, pkg);