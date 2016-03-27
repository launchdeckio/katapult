'use strict';

const Directive = require('./Directive');

class CacheableDirective extends Directive {

    /**
     * @param {string} string The command to be executed
     * @param {string|string[]} input
     * @param {string|string[]} output
     * @param {Number|null} [ttl = null] The command's TTL (null for no expiry)
     */
    constructor(string, input, output, ttl) {
        super(string);
        this.input  = input;
        this.output = output;
        this.ttl    = ttl ? ttl : null;
    }

    /**
     * @returns {Number}
     */
    getTtl() {
        return this.ttl;
    }

    /**
     * @returns {string|string[]}
     */
    getInput() {
        return this.input;
    }

    /**
     * @returns {string|string[]}
     */
    getOutput() {
        return this.output;
    }
}

module.exports = CacheableDirective;