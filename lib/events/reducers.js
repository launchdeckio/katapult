'use strict';

/* eslint-disable no-console */

const events   = require('./');
const _        = require('lodash');
const filesize = require('filesize');

module.exports = (parser, options) => {

    if (options.format)
        parser.useCombine({

            [events.CLEANUP_CACHE]: (cleanupCache) => {

                let current  = cleanupCache.get('current');
                let allowed  = cleanupCache.get('allowed');
                let removing = cleanupCache.get('removing').toJS();

                console.log(`Cache (${filesize(current)}) exceeds maximum allowed size (${filesize(allowed)}), removing ${removing.length} stored results.`);
                console.log(_.map(removing, removing => ` - ${removing.fileName}`).join('\n'));
            },

            [events.FINALIZE_CACHE]: (finalizeCache) => {
                console.log(`Finalizing caching operations... (${finalizeCache.get('queueLength')} in queue)`);
            },
        });
};