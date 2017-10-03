'use strict';

const {pick, defaults} = require('lodash');

const Directive = require('./Directive');

/**
 * Extends the Directive class with optional
 * context-independent cache options
 */
class CacheableDirective extends Directive {

    /**
     * @param {Object} directive The parameters for the directive
     * @param {Object} cacheOptions
     * @param {string|string[]} cacheOptions.input
     * @param {string|string[]} cacheOptions.output
     * @param {Number|null} [cacheOptions.ttl = null] The command's TTL (null for no expiry)
     */
    constructor(directive, cacheOptions) {
        super(directive);
        defaults(cacheOptions, {
            ttl:      null,
            compress: true
        });
        this.cacheOptions = pick(cacheOptions, ['input', 'output', 'ttl']);
    }
}

module.exports = CacheableDirective;