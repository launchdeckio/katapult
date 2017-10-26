'use strict';

const path     = require('path');
const bluebird = require('bluebird');

const fs = bluebird.promisifyAll(require('fs'));

/**
 * Get files and directories in the root directory
 * @param {String} root
 * @returns {{name, stat}[]}
 */
module.exports = async root => {
    const names = await fs.readdirAsync(root);
    return bluebird.map(names, async name => {
        const absolutePath = path.join(root, name);
        const stat         = await fs.lstatAsync(absolutePath);
        return {name, stat};
    });
};