'use strict';

const del = require('del');

const Workspace = require('../common/Workspace');

module.exports = context => {

    const workspace = new Workspace({
        ...context.args,
        disableCache: true,
    });

    return del(workspace.cacheFolder, {
        force: true
    });
};