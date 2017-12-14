'use strict';

const Option = require('shipment').Option;
const fs     = require('fs');
const _      = require('lodash');

module.exports = new Option('workspace', yargs => {
    yargs
        .describe('workspace', 'The workspace base path, used for cache and other metadata')
        .string('workspace')
        .alias('w', 'workspace');
    return yargs;
}, (options, argv) => {
    if (_.isString(argv.workspace)) options.workspacePath = fs.realpathSync(argv.workspace);
});