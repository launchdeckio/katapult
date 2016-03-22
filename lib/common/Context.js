'use strict';

var Reporter = require('./Reporter'),
    _        = require('lodash');

class Context {

    /**
     * Represents a context in which a build is executed
     * @param {Context} [parentContext]
     * @param {Reporter} [reporter]
     * @param {Object} [options]
     * @constructor
     */
    constructor(parentContext, reporter, options) {
        this.parentContext = parentContext;
        this.reporter      = typeof reporter === typeof undefined && typeof parentContext === typeof undefined ?
            new Reporter(this) : reporter;
        this.options       = _.assign({}, options);
    }

    /**
     * Gets the associated reporter
     * @returns {Reporter}
     */
    getReporter() {
        return typeof this.reporter === typeof undefined ? this.parentContext.getReporter : this.reporter;
    }

    /**
     * Gets a deep merged list of all the options included in this and parent contexts
     * @returns {Object}
     */
    getOptions() {
        return _.assign({}, Context.getDefaultOptions(), _.isUndefined(this.parentContext) ? {} : this.parentContext.getOptions(), this.options);
    }

    /**
     * Returns whether the open flag is set
     * @returns {boolean}
     */
    isOpen() {
        return this.getOptions().open;
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
        return this.getOptions().verbosity >= 1;
    }

    /**
     * Returns whether the confirm flag is on
     * @returns {boolean}
     */
    isConfirm() {
        return !!this.getOptions().confirm;
    }

    /**
     * Returns whether the context is extra verbose
     * @returns {boolean}
     */
    isExtraVerbose() {
        return this.getOptions().verbosity >= 2;
    }

    static createCliContext() {
        return new Context(undefined, undefined, {
            wd: process.cwd()
        });
    }

    static getDefaultOptions() {
        return {
            open:      false,
            verbosity: 0
        };
    }
}

module.exports = Context;
