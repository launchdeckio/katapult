'use strict';

const _                  = require('lodash');
const path               = require('path');
const fs                 = require('fs');
const {flattenGlobArray} = require('./globUtils');

/**
 * Read and process the ignore globs from an ignore file
 * @param {string} filename filename
 * @param {string} [wd] If given, prepends this instead of the dirname of the containing file to the globs
 * @returns {Array.<string>}
 */
module.exports = (filename, wd) => {
    // @TODO use agent for reading the files
    let dirname = path.dirname(filename);

    let rawIgnores = fs.readFileSync(filename, 'utf8')
        .replace(/\//g, path.sep)
        .trim()
        .split(/(\r|\n)+/);

    return _(rawIgnores)
        .chain()
        .filter(ignore => ignore && !/^(\r|\n)+$/.test(ignore))
        .thru(flattenGlobArray)
        .map(glob => {
            let dir      = wd ? wd : dirname;
            let negating = _.startsWith(glob, '!');
            return (negating ? '!' : '') + path.join(dir, negating ? glob.substring(1) : glob);
        })
        .value();
};