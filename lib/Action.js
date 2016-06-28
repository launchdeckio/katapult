'use strict';

const Context = require('./common/Context');

const BaseAction = require('shipment').Action;

class Action extends BaseAction {

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