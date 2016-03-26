'use strict';

var _ = require('lodash');

class Option {

    /**
     * Represents a CLI option
     * @param {Function} transformYargs A function that adds the relevant options and aliases to the yargs object
     * @param {Function} transformContext A function that transforms the Context object based on the argv object
     * @constructor
     */
    constructor(transformYargs, transformContext) {
        this.transformYargs   = transformYargs;
        this.transformContext = transformContext;
    }

    /**
     * Creates a simple flag option
     * @param {string} flag
     * @param {string} [description]
     * @param {string} [shorthand]
     * @returns {Option}
     */
    static createSimpleFlag(flag, description, shorthand) {
        return new Option(yargs => {
            yargs = yargs.count(flag);
            if (description)
                yargs = yargs.describe(flag, description);
            if (shorthand)
                yargs = yargs.alias(shorthand, flag);
            return yargs;
        }, (context, argv) => {
            context.options[flag] = argv[flag];
            return context;
        });
    }
}

module.exports = Option;