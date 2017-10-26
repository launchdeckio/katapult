'use strict';

const {isString} = require('lodash');

/**
 * Runs the given callback (which should return a promise) in the given working directory,
 * changing it back afterwards
 * @param {string} [tempWorkingDirectory = process.cwd()]
 * @param {Function} callback
 * @returns {Promise}
 */
module.exports = async (tempWorkingDirectory, callback) => {

    if (!isString(tempWorkingDirectory))
        tempWorkingDirectory = process.cwd();

    const oldWorkingDirectory = process.cwd();
    process.chdir(tempWorkingDirectory);
    try {
        return await callback();
    } finally {
        process.chdir(oldWorkingDirectory);
    }
};