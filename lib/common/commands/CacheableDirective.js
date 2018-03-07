'use strict';

const Directive = require('./Directive');

/**
 * Extends the Directive class with optional
 * context-independent cache options
 */
class CacheableDirective extends Directive {

    /**
     * @param {Object} params The parameters for the directive
     * @param {Object} cacheOptions
     * @param {string|string[]} cacheOptions.input
     * @param {string|string[]} cacheOptions.output
     * @param {Number|null} [cacheOptions.ttl = null] The command's TTL (null for no expiry)
     */
    constructor(params, {
        input,
        output,
        ttl = null,
        intermediate = false,
        compress = true
    }) {
        super(params);
        this.cacheOptions = {input, output, ttl, compress, intermediate};
    }
}

module.exports = CacheableDirective;