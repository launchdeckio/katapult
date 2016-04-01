'use strict';

const Option = require('./../Option');
const fs     = require('fs');
const _      = require('lodash');

module.exports = new Option(yargs => {
    yargs.describe('workspace', 'The workspace base path');
    yargs.alias('w', 'workspace');
    return yargs;
}, (options, argv) => {
    if (_.isString(argv.workspace)) options.workspacePath = fs.realpathSync(argv.workspace);
});