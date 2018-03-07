'use strict';

const events = require('../events.js');

const {RestoredFromCache, SavedToCache} = require('johnnycache');

const getCacheResultEvent = obj => {

    if (obj instanceof RestoredFromCache) return events.cacheRestored({
        runtime:  obj.runtime,
        fileSize: obj.result.fileSize,
    });

    if (obj instanceof SavedToCache) return events.cacheSaved({
        runtime:  obj.storageRuntime,
        fileSize: obj.result.fileSize,
    });
};

module.exports = getCacheResultEvent;