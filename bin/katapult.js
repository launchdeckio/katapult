#!/usr/bin/env node
'use strict';

const {cli} = require('shipment');

const {cliFormatter: smpFormatter} = require('shipment-monitor-process');

const formatter = require('./../lib/cliFormatter');

const actions = {
    ...require('./../lib/actions'),
    package: require('./../lib/actions/package'),
};

cli(actions, {

    formatters: [
        formatter,
        smpFormatter,
    ],

    actions: {
        package:    '"runInstall", "runBuild" and "purge" serially',
        runInstall: 'Run the install commands',
        runBuild:   'Run the build commands',
        purge:      'Delete all files matching "purge" globs',
        readSum:    'Output hash tree for the build',
        clearCache: 'Empty cached results from install/build',
    },

    options: {
        b: {
            alias:       'buildpath',
            description: 'Build "root" directory',
            type:        'string',
        },
        w: {
            alias:       'workspace',
            description: 'Metadata storage path',
            type:        'string',
        },
        m: {
            alias:       'maxCacheSize',
            description: 'Max allowed cache size',
            type:        'string',
        },
        d: {
            alias:       'disableCache',
            description: 'Disable caching',
            type:        'boolean',
        }
    }

}).exec();