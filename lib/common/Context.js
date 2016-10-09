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
     * @param {Object} [scope]
     * @param {Context} [parent}
     * @constructor
     */
    constructor(options, scope, parent) {
        super(options, scope, parent);
        defaults(options, {
            workspacePath: process.env.KATAPULT_WORKSPACE
        }, {
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
        this.predictableMetaFiles = options['predictable-metafiles'];
        this.workspace            = options.workspace;
        this.created              = new Date().getTime();

        // "bubble up" queue so that all jobs will get attached to the root queue
        this.queue = (parent && parent.queue) ? parent.queue : new TaskQueue();
    }
}
Context.Reporter = Reporter;

module.exports = Context;
