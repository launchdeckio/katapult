'use strict';

const Option = require('./../Option');
const fs     = require('fs');

module.exports = new Option(yargs => {
    yargs.describe('workspace', 'The workspace base path');
    yargs.alias('w', 'workspace');
    return yargs;
}, (options, argv) => {
    options.workspacePath = fs.realpathSync(argv.workspace);
});