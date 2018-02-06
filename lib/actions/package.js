'use strict';

const runInstall = require('./runInstall');
const runBuild   = require('./runBuild');
const purge      = require('./purge');

const withWorkspace = require('../withWorkspace');

module.exports = withWorkspace(async context => {
    await runInstall(context);
    await runBuild(context);
    await purge(context);
});