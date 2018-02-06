'use strict';

const events = require('../events');

module.exports = (emit, cache) => {

    // TODO more explicit event payload definition
    cache.on('cleanup', data => emit(events.cleanupCache(data)));

    // TODO more explicit event payload definition
    cache.on('query', data => emit(events.queryCache(data)));

    // TODO more explicit event payload definition
    cache.on('saved', data => emit(events.savedResultToCache(data)));
};