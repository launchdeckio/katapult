'use strict';

const _         = require('lodash');
const defaults  = require('defa');
const Directive = require('./Directive');

class CacheableDirective extends Directive {

    /**
     * @param {string} command The command to be executed
     * @param {Object} cacheOptions
     * @param {string|string[]} cacheOptions.input
     * @param {string|string[]} cacheOptions.output
     * @param {Number|null} [cacheOptions.ttl = null] The command's TTL (null for no expiry)
     */
    constructor(command, cacheOptions) {
        super(command);
        defaults(cacheOptions, {
            ttl:      null,
            compress: true
        });
        this.cacheOptions = _.pick(cacheOptions, ['input', 'output', 'ttl']);
    }
}

module.exports = CacheableDirective;