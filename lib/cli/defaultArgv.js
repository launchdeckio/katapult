'use strict';

module.exports = function (optionStream, usage) {
    var yargs = optionStream ? optionStream.transformYargs(require('yargs')) : require('yargs');
    return yargs
        .help('h')
        .alias('h', 'help')
        .usage(usage)
        .argv;
};