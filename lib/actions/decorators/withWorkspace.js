'use strict';

const Workspace = require('../../common/Workspace');

/**
 * "Higher-order action" that will expose a Workspace instance
 * on context.env based on the context.args, given that no
 * Workspace instance has been previously defined
 * @param {function} fn
 * @returns {function}
 */
module.exports = fn => context => {
    if (!context.env.workspace) {
        context.env.workspace = new Workspace(context.args, context.emit);
    }
    return fn(context);
};