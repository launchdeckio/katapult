'use strict';

const Option = require('./../Option');

module.exports = new Option(yargs => {
    yargs.describe('workspace', 'The workspace base path');
    yargs.alias('w', 'workspace');
    return yargs;
}, (options, argv) => {
    options['workspacePath'] = argv['workspace'];
});