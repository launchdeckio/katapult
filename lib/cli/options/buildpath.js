'use strict';

const Option = require('shipment').Option;

module.exports = new Option('buildpath', yargs => {
    yargs
        .describe('buildpath', 'The path at which the build resides (defaults to process.cwd())')
        .string('buildpath')
        .alias('b', 'buildpath');
    return yargs;
}, (options, argv) => {
    options.buildpath = argv.buildpath;
});