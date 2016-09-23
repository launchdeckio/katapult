'use strict';

const Context = require('./common/Context');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

    afterRun(context, options) {
        if (context.queue.hasTasksPending()) {
            context.report("info", "Finalizing cache operations, stay tuned...");
            return context.queue.finalize();
        }
    }
}
Action.Context = Context;

module.exports = Action;