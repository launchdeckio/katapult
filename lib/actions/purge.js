'use strict';

const withWorkspace = require('./decorators/withWorkspace');

module.exports = withWorkspace(context => {
    return context.env.workspace.buildTree.clean(context);
});