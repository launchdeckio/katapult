'use strict';

const {blue, bold, grey} = require('chalk');
const filesize           = require('filesize');

const readableInterval = require('./common/util/readableInterval');

module.exports = () => (evt, {context}) => {

    if (evt.cleanupCache) {

        const current  = evt.cleanupCache.current;
        const allowed  = evt.cleanupCache.allowed;
        const removing = evt.cleanupCache.removing;

        return `Cache (${filesize(current)}) exceeds maximum allowed size (${filesize(allowed)}), ` +
            `removing ${removing.length} stored result(s).` +
            removing.map(removing => ` - ${removing.fileName}`).join('\n');
    }

    if (evt.cacheRestoring) {
        const command = context.scope.command;
        const cwd     = command.relativeDirectory ? `<package>/${command.relativeDirectory}` : '<package>';
        return `${blue(cwd)} ${grey('$')} ${bold(command.directive.command)} (from cache)`;
    }

    if (evt.cacheRestored)
        return `Restored ${filesize(evt.cacheRestored.fileSize)} from cache ` +
            `in ${readableInterval(evt.cacheRestored.runtime)}`;

    if (evt.cacheSaved)
        return `Saved ${filesize(evt.cacheSaved.fileSize)} to cache ` +
            `in ${readableInterval(evt.cacheSaved.runtime)}`;
};