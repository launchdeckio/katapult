'use strict';

const Workspace = require('./common/Workspace');

module.exports = fn => context => {
    if (!context.env.workspace) context.env.workspace = new Workspace(context.args);
    return fn(context);
};