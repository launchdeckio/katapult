'use strict';

const _         = require('lodash');
const path      = require('path');
const fs        = require('fs');
const globUtils = require('./globUtils');

/**
 * Read and process the ignore globs from an ignore file
 * @param {string} filename
 * @returns {Array.<string>}
 */
module.exports = filename => {
    let dirname    = path.dirname(filename);
    let rawIgnores = fs.readFileSync(filename, 'utf8')
        .replace(/\//g, path.sep)
        .trim()
        .split(/(\r|\n)+/);
    return _(globUtils.flattenGlobArray(_.filter(rawIgnores, ignore => ignore && !/^(\r|\n)+$/.test(ignore))))
        .map(glob => {
            let negating = _.startsWith(glob, '!');
            return (negating ? '!' : '') + path.join(dirname, negating ? glob.substring(1) : glob);
        }).value();
};