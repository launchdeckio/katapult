'use strict';

const events = require('./');

module.exports = (parser, options) => {

    if (options.format)
        parser.useCombine({
            [events.FINALIZE_CACHE]: (finalizeCache) => {
                console.log(`Finalizing caching operations... (${finalizeCache.get('queueLength')} in queue)`);
            },
        });
};