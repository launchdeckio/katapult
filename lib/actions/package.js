'use strict';

const runInstall = require('./runInstall');
const runBuild   = require('./runBuild');
const purge      = require('./purge');

const api = require('shipment').api({runInstall, runBuild, purge});

const withWorkspace = require('./decorators/withWorkspace');

module.exports = withWorkspace(async context => {
    try {
        await api.runInstall({}, null, context);
        await api.runBuild({}, null, context);
        await api.purge({}, null, context);
    } catch (e) {
        // we silently catch the error here
        // as it will be emitted as an "error" event anyways
        // at sub-action level by the shipment action lifecycle handler
    }
});