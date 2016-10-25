'use strict';

const events = require('./');

module.exports = {

    [events.CACHE_STORING]:   (context, cacheStoring) => ({cacheStoring}),
    [events.CACHE_STORED]:    (context, cacheStored) => ({cacheStored}),
    [events.CACHE_RESTORING]: (context, cacheRestoring) => ({cacheRestoring}),
    [events.CACHE_RESTORED]:  (context, cacheRestored) => ({cacheRestored}),

    [events.CLEAN]: (context, clean) => ({clean}),

    [events.RUN_INSTALL]: (context, runInstall) => ({runInstall}),
    [events.RUN_BUILD]:   (context, runBuild) => ({runBuild}),

    [events.CLEANUP_CACHE]:         (context, cleanupCache) => ({cleanupCache}),
    [events.QUERY_CACHE]:           (context, queryCache) => ({queryCache}),
    [events.SAVED_RESULT_TO_CACHE]: (context, savedResultToCache) => ({savedResultToCache}),
    [events.FINALIZE_CACHE]:        (context, queueLength) => ({finalizeCache: {queueLength}}),
};