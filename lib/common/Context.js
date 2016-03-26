'use strict';

var Reporter = require('./Reporter'),
    _        = require('lodash');

class Context {

    /**
     * Represents a context in which an action is executed
     * @param {Object} [options]
     * @constructor
     */
    constructor(options) {
        options        = _.defaults(options, {
            reporter:  new Reporter(),
            verbosity: 0
        });
        this.reporter  = options.reporter;
        this.verbosity = options.verbosity;
        this.created   = new Date().getTime();
    }

    /**
     * Gets the associated reporter
     * @returns {Reporter}
     */
    getReporter() {
        return this.reporter;
    }

    /**
     * Whether caching is enabled
     * @returns {boolean}
     */
    enableCaching() {
        return !this.getOptions().disableCache && this.cache;
    }

    getWorkingDirectory() {
        return this.getOptions().wd;
    }

    /**
     * Get the amount of milliseconds that have passed since this context was createdd
     * @returns {number}
     */
    getUptime() {
        return new Date().getTime() - this.created;
    }

    /**
     * Returns whether the disable cache flag is set
     * @returns {boolean}
     */
    isDisableCache() {
        return this.getOptions()['disable-cache'];
    }

    /**
     * Returns whether the context is verbose
     * @returns {boolean}
     */
    isVerbose() {
        return !!this.verbosity;
    }

    /**
     * Returns whether the confirm flag is on
     * @returns {boolean}
     */
    isConfirm() {
        return !!this.getOptions().confirm;
    }

    static createCliContext() {
        return new Context(undefined, undefined, {
            wd: process.cwd()
        });
    }
}

module.exports = Context;
