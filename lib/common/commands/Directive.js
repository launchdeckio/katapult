'use strict';

/**
 * A context-independent directive as specified by a user
 * The data structure contains the shell command
 * And an optional sub-path (the sub-path will be appended
 * to the working directory when running in a given context)
 */
class Directive {

    /**
     * @param string command The full shell command as a string
     * @param string subPath The sub-path to append to the working directory
     */
    constructor({command, subPath}) {
        this.command = command;
        this.subPath = subPath;
    }

    get identifier() {
        return (this.subPath ? `/ ${this.subPath} ` : '') + `$ ${this.command}`;
    }
}

module.exports = Directive;