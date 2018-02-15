'use strict';

const events = require('../events.js');

const {RestoredFromCache} = require('johnnycache');

const getCacheResultEvent = obj => {

    if (obj instanceof RestoredFromCache) return events.cacheRestored({
        runtime:  obj.runtime,
        fileSize: obj.result.fileSize,
    });
};

module.exports = getCacheResultEvent;