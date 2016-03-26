'use strict';

const Directive = require('./Directive');

class CacheableDirective extends Directive {

    /**
     * @param {string} string The command to be executed
     * @param {string|string[]} input
     * @param {string|string[]} output
     * @param {Number} [ttl]
     */
    constructor(string, input, output, ttl) {
        super(string);
        this.input  = input;
        this.output = output;
        this.ttl    = ttl;
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