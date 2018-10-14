'use strict';

const runInstall = require('./runInstall');
const runBuild   = require('./runBuild');
const purge      = require('./purge');

const api = require('shipment').api({runInstall, runBuild, purge});

const withWorkspace = require('./decorators/withWorkspace');

module.exports = withWorkspace(async context => {

    // We're creating a subcontext here that will not emit
    // errors, and use that context when invoking the subactions.
    // This is because errors that occur in subactions will also be
    // thrown as JS errors and thus will be caught and emitted
    // at the action lifecycle decorator level of this action.
    const subContext = context.branch({}, emit => evt => {
        if (!evt.error) emit(evt);
    });

    await api.runInstall({}, null, subContext);
    await api.runBuild({}, null, subContext);
    await api.purge({}, null, subContext);
});