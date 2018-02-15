'use strict';

module.exports = {

    cacheRestoring: ({fileSize}) => ({cacheRestoring: {fileSize}}),
    cacheRestored:  ({runtime, fileSize}) => ({cacheRestored: {runtime, fileSize}}),
    cleanupCache:   (cleanupCache) => ({cleanupCache}),

    clean:      (clean) => ({clean}),
    runInstall: (runInstall) => ({runInstall}),
    runBuild:   (runBuild) => ({runBuild}),
};