'use strict';

var _ = require('lodash');

class Option {

    /**
     * Represents a CLI option
     * @param {Function} transformYargs A function that adds the relevant options and aliases to the yargs object
     * @param {Function} transformContextOptions A function that transforms the Context options based on the argv object
     * @constructor
     */
    constructor(transformYargs, transformContextOptions) {
        this._transformYargs          = transformYargs;
        this._transformContextOptions = transformContextOptions;
    }

    transformYargs(yargs) {
        return this._transformYargs(yargs);
    }

    transformContextOptions(options, argv) {
        return this._transformContextOptions(options, argv);
    }

    /**
     * Creates a simple flag option
     * @param {string} flag
     * @param {string} [description]
     * @param {string} [shorthand]
     * @param {boolean} [count = false] Whether to use the "count" argument type
     * @returns {Option}
     */
    static createSimpleFlag(flag, description, shorthand, count) {
        return new Option(yargs => {
            yargs = (count ? yargs.count : yargs.boolean)(flag);
            if (description)
                yargs = yargs.describe(flag, description);
            if (shorthand)
                yargs = yargs.alias(shorthand, flag);
            return yargs;
        }, (options, argv) => {
            options[flag] = argv[flag];
            return options;
        });
    }
}

module.exports = Option;