'use strict';

const Reporter  = require('./Reporter');
const Workspace = require('./../Workspace');
const _         = require('lodash');
const defaults  = require('defa');

class Context {

    /**
     * Represents a context in which an action is executed
     * @param {Object} [options]
     * @constructor
     */
    constructor(options) {
        options        = defaults(options, {
            verbosity:       0,
            reporter:        new Reporter(),
            wd:              process.cwd(),
            workspacePath:   process.cwd(),
            'disable-cache': false
        }, options => {
            return {
                workspace: () => Workspace.create({
                    basePath: options.workspacePath,
                    cache:    !options['disable-cache']
                })
            };
        });
        this.workspace = options.workspace;
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
}

module.exports = Context;
