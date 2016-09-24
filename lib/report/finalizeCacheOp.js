'use strict';

module.exports = (context, result) => {

    if (result.savedToCache)
        context.queue.push(result.savedToCache);

    // RestoredFromCache
    if (result.runtime && !result.action)
        context.reporter.report({restored: true, runtime: result.runtime});

    // StoringResult
    else if (result.savedToCache && result.cacheableOperation)
        context.reporter.report({storing: true, runtime: result.cacheableOperation.runtime});

    // SavedToCache
    if (result.operationRuntime && result.storageRuntime)
        context.reporter.report({stored: true, filesize: result.cachedResult.fileSize});
};