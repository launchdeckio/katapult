'use strict';

const del = require('del');

const Workspace = require('../common/Workspace');

module.exports = async context => {

    const workspace = new Workspace({
        ...context.args,
        disableCache: true,
    });

    await del(workspace.cacheFolder, {
        force: true
    });
};