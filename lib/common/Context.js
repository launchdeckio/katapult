'use strict';

const defaults    = require('defa');
const BaseContext = require('shipment').Context;

const Reporter  = require('./Reporter');
const Workspace = require('./../Workspace');
const TaskQueue = require('./TaskQueue');
const constants = require('./../../constants.json');


class Context extends BaseContext {

    /**
     * Represents a context in which an action is executed
     * @param {Object} [options]
     * @constructor
     */
    constructor(options) {
        super(options);
        defaults(options, {
            workspacePath: process.env.KATAPULT_WORKSPACE
        }, {
            preview:         false,
            wd:              process.cwd(),
            workspacePath:   process.cwd(),
            'disable-cache': false
        }, {
            cache: options => !options['disable-cache']
        }, {
            workspace: options => Workspace.create({
                basePath: options.workspacePath,
                cache:    options.cache
            })
        });
        this.preview   = options.preview;
        this.workspace = options.workspace;
        this.created   = new Date().getTime();
        this.queue     = new TaskQueue();
    }

    /**
     * Instantiate a new reporter
     * @returns {Reporter}
     */
    makeReporter() {
        return new Reporter();
    }
}

module.exports = Context;
