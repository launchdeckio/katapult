'use strict';

const Option = require('shipment').Option;
const fs     = require('fs');
const _      = require('lodash');

module.exports = new Option('workspace', yargs => {
    yargs.describe('workspace', 'The workspace base path (may also be defined using environment variable KATAPULT_WORKSPACE)');
    yargs.alias('w', 'workspace');
    return yargs;
}, (options, argv) => {
    if (_.isString(argv.workspace)) options.workspacePath = fs.realpathSync(argv.workspace);
});