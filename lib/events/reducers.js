'use strict';

/* eslint-disable no-console */

const {map}              = require('lodash');
const {blue, bold, grey} = require('chalk');
const filesize           = require('filesize');

const events           = require('./');
const readableInterval = require('./../common/util/readableInterval');

module.exports = (parser, options) => {

    // TODO override result reducer so that results only get outputted in non-CLI mode


    if (options.format)
        parser.useCombine({

            [events.CLEANUP_CACHE]: (cleanupCache) => {

                const current  = cleanupCache.get('current');
                const allowed  = cleanupCache.get('allowed');
                const removing = cleanupCache.get('removing').toJS();

                console.log(`Cache (${filesize(current)}) exceeds maximum allowed size (${filesize(allowed)}), ` +
                    `removing ${removing.length} stored result(s).`);
                console.log(map(removing, removing => ` - ${removing.fileName}`).join('\n'));
            },

            [events.CACHE_RESTORING]: (cacheRestoring, {context}) => {
                const command = context.scope.command;
                const cwd     = command.relativeDirectory ? `<package>/${command.relativeDirectory}` : '<package>';
                console.log(`\n${blue(cwd)} ${grey('$')} ${bold(command.directive.command)} (from cache)`);
            },

            [events.CACHE_RESTORED]: (cacheRestored) => {
                let restored = cacheRestored.get('restoredFromCache');
                console.log(`Restored ${filesize(restored.cachedResult.fileSize)} in ${readableInterval(restored.runtime)}`);
            },

            [events.FINALIZE_CACHE]: (finalizeCache) => {
                console.log(`Finalizing caching operations... (${finalizeCache.get('queueLength')} in queue)`);
            },
        });
};