'use strict';

const {isString} = require('lodash');

/**
 * Runs the given callback (which should return a promise) in the given working directory, changing it back
 * afterwards
 * @param {string} [workingDirectory = process.cwd()]
 * @param {Function} callback
 * @returns {Promise}
 */
module.exports = (workingDirectory, callback) => {

    if (!isString(workingDirectory))
        workingDirectory = process.cwd();
    const oldWorkingDirectory = process.cwd();
    process.chdir(workingDirectory);
    return callback().then(() => process.chdir(oldWorkingDirectory));
};