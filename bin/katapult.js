#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const updateNotifier = require('update-notifier');
const pkg            = require('./../package.json');

updateNotifier({pkg}).notify();

let yargs = require('yargs').usage('$0 <cmd> [args]');

_.each(require('./../lib/cli/actions'), Action => (new Action()).register(yargs));

yargs = yargs
    .help('h')
    .alias('h', 'help')
    .version()
    .argv;