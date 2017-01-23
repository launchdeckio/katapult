'use strict';

/* eslint-disable no-console */

const _        = require('lodash');
const chalk    = require('chalk');
const filesize = require('filesize');

const events           = require('./');
const readableInterval = require('./../common/util/readableInterval');

module.exports = (parser, options) => {

    if (options.format)
        parser.useCombine({

            [events.CLEANUP_CACHE]: (cleanupCache) => {

                const current  = cleanupCache.get('current');
                const allowed  = cleanupCache.get('allowed');
                const removing = cleanupCache.get('removing').toJS();

                console.log(`Cache (${filesize(current)}) exceeds maximum allowed size (${filesize(allowed)}), removing ${removing.length} stored results.`);
                console.log(_.map(removing, removing => ` - ${removing.fileName}`).join('\n'));
            },

            [events.CACHE_RESTORING]: (cacheRestoring, {context}) => {
                const command = context.scope.command;
                const cwd     = command.relativeDirectory ? `<package>/${command.relativeDirectory}` : '<package>';
                console.log(`\n${chalk.blue(cwd)} ${chalk.grey('$')} ${chalk.bold(command.directive.command)} (from cache)`);
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