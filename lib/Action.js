'use strict';

const Context = require('./common/Context');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

    afterRun(context, options) {
        if (context.queue.hasTasksPending()) {
            context.reporter.info("Finalizing cache operations, stay tuned...");
            return context.queue.finalize();
        }
    }

    /**
     * Make a Context instance based on the given arguments
     * @param {Object} argv
     * @returns {Context}
     */
    makeContext(argv) {
        return new Context(this.getContextOptions(argv));
    }
}

module.exports = Action;