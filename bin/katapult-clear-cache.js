#!/usr/bin/env node
'use strict';

const path          = require('path');
const Promise       = require('bluebird');
const del           = require('del');
const constants     = require('./../constants.json');
const createCommand = require('./../lib/cli/createCommand');
const defaultArgv   = require('./../lib/cli/defaultArgv');

exports.command = {
    description: 'Clear the build cache'
};

const katapultClearCache = createCommand((argv, context) => {
    return Promise.resolve(del(path.join(constants.workspace, constants.cacheFolder)));
}, {
    action:    'Clear cache',
    completed: 'Cache cleared'
});

if (require.main === module) {
    katapultClearCache(defaultArgv(null, 'Usage: katapult clear-cache'));
}