'use strict';

const Directive = require('./Directive');

class CacheableDirective extends Directive {

    constructor(string, input, output) {
        super(string);
        this.input  = input;
        this.output = output;
    }

    getInput() {
        return this.input;
    }

    getOutput() {
        return this.output;
    }
}

module.exports = CacheableDirective;