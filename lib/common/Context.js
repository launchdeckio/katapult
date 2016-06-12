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
        defaults(options, {
            preview:         false,
            verbosity:       0,
            reporter:        new Reporter(),
            wd:              process.cwd(),
            workspacePath:   process.cwd(),
            'disable-cache': false
        }, options => {
            return {
                cache: !options['disable-cache']
            };
        }, options => {
            return {
                workspace: () => Workspace.create({
                    basePath: options.workspacePath,
                    cache:    options.cache
                })
            };
        });
        this.preview   = options.preview;
        this.workspace = options.workspace;
        this.reporter  = options.reporter;
        this.verbosity = options.verbosity;
        this.created   = new Date().getTime();
    }

    /**
     * Get the amount of milliseconds that have passed since this context was createdd
     * @returns {number}
     */
    getUptime() {
        return new Date().getTime() - this.created;
    }
}

module.exports = Context;
