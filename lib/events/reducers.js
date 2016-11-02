'use strict';

const events = require('./');

module.exports = (parser, options) => {

    if (options.format)
        parser.useCombine({

            [events.CLEANUP_CACHE]: (cleanupCache) => {

                let current  = cleanupCache.get('current');
                let allowed  = cleanupCache.get('allowed');
                let removing = cleanupCache.get('removing');

                console.log(`Cache (${current}) exceeds maximum allowed size (${allowed}), 
                removing ${removing.length} stored results.`);
            },

            [events.FINALIZE_CACHE]: (finalizeCache) => {
                console.log(`Finalizing caching operations... (${finalizeCache.get('queueLength')} in queue)`);
            },
        });
};