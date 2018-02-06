#!/usr/bin/env node
'use strict';

const {cli} = require('shipment');

const actions   = require('./../lib/actions');
const formatter = require('./../lib/cliFormatter');

cli(actions, {formatters: [formatter]}).exec();