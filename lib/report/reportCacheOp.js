'use strict';

const events = require('./../events');

const reportCacheOp = (context, result) => {

    if (result.savedToCache)
        context.queue.push(result.savedToCache.then(savedToCache => reportCacheOp(context, savedToCache)));

    // {RestoredFromCache}
    if (result.runtime && !result.action)
        context.emit[events.CACHE_RESTORED]({restoredFromCache: result});

    // {StoringResult}
    if (result.savedToCache && result.cacheableOperation)
        context.emit[events.CACHE_STORING]({storingResult: result});

    // {SavedToCache}
    if (result.operationRuntime && result.storageRuntime)
        context.emit[events.CACHE_STORED]({savedToCache: result});
};

module.exports = reportCacheOp;