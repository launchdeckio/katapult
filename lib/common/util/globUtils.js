'use strict';

const _               = require('lodash');
const path            = require('path');
const isGlobBlacklist = require('is-glob-blacklist');

module.exports = {

    /**
     * If the globArray is a negating glob array, prepends * and .* to the array
     * @param {Array.<string>} globArray
     * @returns {Array.<string>}
     */
    resolveGlobArray: function (globArray) {
        return isGlobBlacklist(globArray) ? ['*', '.*'].concat(globArray) : globArray;
    },

    /**
     * "flattens" the glob array, making it suitable for applying as a linear filter
     * (when traversing directories layer-by-layer)
     * @param {string[]} globArray
     * @returns {string[]}
     */
    flattenGlobArray: function (globArray) {
        if (isGlobBlacklist(globArray)) {
            var newGlobs       = [];
            var globComponents = ['*'];
            _.each(globArray, ignore => {
                newGlobs.push(ignore);
                if (_.startsWith(ignore, '!')) {
                    var comps = [];
                    var parts = ignore.substring(1).split(path.sep);
                    _.each(_.slice(parts, 0, parts.length - 1), pathComp => {
                        comps.push(pathComp);
                        var subPath = comps.join(path.sep);
                        globComponents.push('!' + subPath);
                        globComponents.push(path.join(subPath, '*'));
                    });
                    newGlobs.push(path.join(ignore, '**'));
                }
            });
            globArray = globComponents.concat(newGlobs);
        }
        return globArray;
    }
};