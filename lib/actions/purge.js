'use strict';

const withWorkspace = require('../withWorkspace');

module.exports = withWorkspace(context => {
    return context.env.workspace.buildTree.clean(context);
});