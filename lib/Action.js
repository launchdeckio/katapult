'use strict';

const Context = require('./common/Context');
const events  = require('./events');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

    afterRun(context, options) {
        if (context.queue.hasTasksPending()) {
            context.emit[events.FINALIZE_CACHE](context.queue.length);
            return context.queue.finalize();
        }
    }
}
Action.Context = Context;

module.exports = Action;