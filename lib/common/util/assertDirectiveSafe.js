'use strict';

const arrify = require('arrify');

const assertPathsSafe = require('./assertPathsSafe');

module.exports = directive => {

    // If the user has defined a "subpath" for the command
    // we need to check that, as the path will be referenced
    // on the host machine when packing the cache files
    if (directive.subPath) assertPathsSafe([directive.subPath]);

    if (directive.cacheOptions.input) assertPathsSafe(arrify(directive.cacheOptions.input));
    if (directive.cacheOptions.output) assertPathsSafe(arrify(directive.cacheOptions.output));
};