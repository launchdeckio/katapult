'use strict';

const _               = require('lodash');
const path            = require('path');
const isGlobBlacklist = require('is-glob-blacklist');

module.exports = {

    /**
     * If the globArray is a "negating" glob array, prepends * and .* to the array
     * @param {Array.<string>} globArray
     * @returns {Array.<string>}
     */
    resolveGlobArray(globArray) {
        return isGlobBlacklist(globArray) ? ['*', '.*'].concat(globArray) : globArray;
    },

    /**
     * "flattens" the glob array, making it suitable for applying as a linear filter
     * (when traversing directories layer-by-layer)
     * @param {string[]} globArray
     * @returns {string[]}
     */
    flattenGlobArray(globArray) {
        if (isGlobBlacklist(globArray)) {
            const newGlobs       = [];
            const globComponents = ['*'];
            _.each(globArray, glob => {
                newGlobs.push(glob);
                if (_.startsWith(glob, '!')) {
                    const comps = [];
                    const parts = glob.substring(1).split(path.sep);
                    _.each(_.slice(parts, 0, parts.length - 1), pathComp => {
                        comps.push(pathComp);
                        const subPath = comps.join(path.sep);
                        globComponents.push('!' + subPath);
                        globComponents.push(path.join(subPath, '*'));
                    });
                    newGlobs.push(path.join(glob, '**'));
                }
            });
            globArray = globComponents.concat(newGlobs);
        }
        return globArray;
    }
};