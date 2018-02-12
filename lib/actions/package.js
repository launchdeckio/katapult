'use strict';

const runInstall = require('./runInstall');
const runBuild   = require('./runBuild');
const purge      = require('./purge');

const api = require('shipment').api({runInstall, runBuild, purge});

const withWorkspace = require('../withWorkspace');

module.exports = withWorkspace(async context => {
    await api.runInstall({}, null, context);
    await api.runBuild({}, null, context);
    await api.purge({}, null, context);
});