'use strict';

const runInstall = require('./runInstall');
const runBuild   = require('./runBuild');
const purge      = require('./purge');

const withWorkspace = require('../withWorkspace');

module.exports = withWorkspace(async context => {
    const results = {};
    const actions = {runInstall, runBuild, purge};
    for (const action in actions)
        results[action] = await actions[action](context);
    return results;
});