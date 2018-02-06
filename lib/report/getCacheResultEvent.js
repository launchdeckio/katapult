'use strict';

const events = require('./../events.js');

const reportCacheOp = (context, result) => {

    // TODO refactoring this so this function
    // only returns the event and does not actually emit it

    if (result.savedToCache) {
        throw new Error('Context cache is not supported anymore');
    }

    // {RestoredFromCache}
    if (result.runtime && !result.action) return events.cacheRestored({restoredFromCache: result});

    // {StoringResult}
    if (result.savedToCache && result.cacheableOperation) return events.cacheStoring({storingResult: result});

    // {SavedToCache}
    if (result.operationRuntime && result.storageRuntime) return events.cacheStored({savedToCache: result});
};

module.exports = reportCacheOp;