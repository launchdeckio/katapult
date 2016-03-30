'use strict';

const Directive = require('./Directive');

class CacheableDirective extends Directive {

    /**
     * @param {string} command The command to be executed
     * @param {string|string[]} input
     * @param {string|string[]} output
     * @param {Number|null} [ttl = null] The command's TTL (null for no expiry)
     */
    constructor(command, input, output, ttl) {
        super(command);
        this.input  = input;
        this.output = output;
        this.ttl    = ttl ? ttl : null;
    }
}

module.exports = CacheableDirective;