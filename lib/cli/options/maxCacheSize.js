'use strict';

const Option = require('shipment').Option;
const _      = require('lodash');

module.exports = new Option('max-cache-size', yargs => {
    yargs
        .alias('m', 'max-cache-size')
        .default('max-cache-size', '512mb')
        .string('max-cache-size');
    return yargs;
}, (options, argv) => {
    if (_.isString(argv['max-cache-size'])) options.maxCacheSize = argv['max-cache-size'];
});