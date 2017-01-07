'use strict';

const _         = require('lodash');
const path      = require('path');
const minimatch = require('minimatch');

const defaultGlobalIgnores = [
    '.git',
    '.katapult'
];

/**
 * Determine if the given directory should be ignored in the process of traversing a directory tree
 * @param {string} directory
 * @param {string[]} [ignores = []] An array of "absolute" ignore globs
 * (will be matched against the full path of the given directory)
 * @param {string[]} [globalIgnores = [".git", ".katapult"]] An array of "relative" directory names, NOT globs
 * (will be matched against the basename of the given directory)
 * @returns {boolean|*}
 */
module.exports = (directory, ignores, globalIgnores) => {

    if (!_.isArray(globalIgnores)) globalIgnores = defaultGlobalIgnores;
    if (!_.isArray(ignores)) ignores = [];

    const ignoredGlobally = _.includes(globalIgnores, path.basename(directory));

    return ignoredGlobally || _.reduce(ignores, (isIgnored, ignore) => {
        let negating = _.startsWith(ignore, '!');
        return (minimatch(directory, negating ? ignore.substring(1) : ignore)) ? !negating : isIgnored;
    }, false);
};