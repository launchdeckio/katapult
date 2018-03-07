'use strict';

const events = require('../events');

module.exports = (emit, cache) => {

    cache.on('cleanup', data => emit(events.cleanupCache(data)));
};