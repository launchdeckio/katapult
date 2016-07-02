'use strict';

const Context = require('./common/Context');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

    run(context, options) {
        return this.runControlled(context, options)
            .then(() => {
                if (context.queue.hasTasksPending()) {
                    context.reporter.info("Finalizing cache operations, stay tuned...");
                    return context.queue.finalize();
                }
            });
    }

    runControlled(context, options) {
        throw new Error('Action needs to provide .runControlled implementation');
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