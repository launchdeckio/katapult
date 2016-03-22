'use strict';

class Directive {

    constructor(string) {
        this.string = string;
    }

    getString() {
        return this.string;
    }
}

module.exports = Directive;