'use strict';

const Context = require('./common/Context');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

    afterRun(context, options) {
        if (context.queue.hasTasksPending()) {
            context.reporter.report({'finalize-cache': context.queue.length});
            return context.queue.finalize();
        }
    }
}
Action.Context = Context;

module.exports = Action;