'use strict';

const path = require('path');

/**
 * Given the "ls" function that performs a regular ("shallow") directory listing,
 * traverse the root directory and all it's descendants (however "guard" may be used
 * to halt traversal at certain nodes)
 * @param {String} root
 * @param {Function} ls
 * @param {Function} [guard] Optional callback that decides whether a node is to be included.
 *                           The guard is invoked with two arguments: (path, stat)
 *                           If the guard returns false, the node is not included
 *                           (and not traversed either if it's a directory)
 * @returns {{path, stat}[]} Where "path" is the absolute path and "stat" is an instance of fs.Stat
 *
 * // @TODO recursive loop protection
 */
const deepLs = async (root, ls, guard = null) => {
    const files   = await ls(root);
    const results = [];
    for (let file of files) {
        const absolutePath = path.join(root, file.name);
        const include      = guard === null ? true : await guard(absolutePath, file.stat);
        if (include) {
            results.push({path: absolutePath, stat: file.stat});
            if (file.stat.isDirectory()) {
                const subResults = await deepLs(absolutePath, ls, guard);
                results.push(...subResults);
            }
        }
    }
    return results;
};

module.exports = deepLs;