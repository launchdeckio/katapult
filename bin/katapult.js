#!/usr/bin/env node
'use strict';

const {cli} = require('shipment');

const actions   = require('./../lib/actions');
const formatter = require('./../lib/cliFormatter');

cli(actions, {

    formatters: [formatter],

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
            default:     '.',
            type:        'string',
        },
        w: {
            alias:       'workspace',
            description: 'Metadata storage path',
            default:     './.katapult',
            type:        'string',
        },
        m: {
            alias:       'maxCacheSize',
            description: 'Max allowed cache size',
            default:     '512mb',
            type:        'string',
        },
        d: {
            alias:       'disableCache',
            description: 'Disable caching',
            default:     false,
            type:        'boolean',
        }
    }

}).exec();