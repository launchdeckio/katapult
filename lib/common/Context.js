'use strict';

const defaults    = require('defa');
const BaseContext = require('shipment').Context;

const Workspace    = require('./../Workspace');
const TaskQueue    = require('./TaskQueue');
const constants    = require('./../../constants.json');
const monitorCache = require('./../report/monitorCacheLifecycle');

class Context extends BaseContext {

    /**
     * Represents a context in which an action is executed
     * @param {Object} [options]
     * @param {Object} [scope]
     * @param {Context} [parentId}
     * @constructor
     */
    constructor(options, scope, parentId) {
        super(options, scope, parentId);
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
        this.queue = (parentId && parentId.queue) ? parentId.queue : new TaskQueue();

        // Monitor cache lifecycle
        if (this.workspace.cache && !this.workspace.cache.monitoring) {
            monitorCache(this, this.workspace.cache);
            this.workspace.cache.monitoring = this;
            // TODO find a neater way to monitor the cache in the most relevant context
        }
    }
}

module.exports = BaseContext.extend(Context,
    [
        require('shipment-monitor-process').eventFactories,
        require('./../events/factories'),
    ],
    [
        require('shipment-monitor-process').eventReducers,
        require('./../events/reducers'),
    ]
);
