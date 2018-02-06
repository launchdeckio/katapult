'use strict';

module.exports = {

    cacheStoring:       (cacheStoring) => ({cacheStoring}),
    cacheStored:        (cacheStored) => ({cacheStored}),
    cacheRestoring:     (cacheRestoring) => ({cacheRestoring}),
    cacheRestored:      (cacheRestored) => ({cacheRestored}),
    cleanupCache:       (cleanupCache) => ({cleanupCache}),
    queryCache:         (queryCache) => ({queryCache}),
    savedResultToCache: (savedResultToCache) => ({savedResultToCache}),
    clean:              (clean) => ({clean}),
    runInstall:         (runInstall) => ({runInstall}),
    runBuild:           (runBuild) => ({runBuild}),
};