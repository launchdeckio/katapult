'use strict';

const events = require('./../events');

module.exports = (context, cache) => {

    cache.on('cleanup', data => context.emit[events.CLEANUP_CACHE](data));
    cache.on('query', data => context.emit[events.QUERY_CACHE](data));
    cache.on('saved', data => context.emit[events.SAVED_RESULT_TO_CACHE](data));
};