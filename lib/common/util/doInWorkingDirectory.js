'use strict';

const _ = require('lodash');

/**
 * Runs the given callback (which should return a promise) in the given working directory, changing it back
 * afterwards
 * @param {Function} callback
 * @param {string} [workingDirectory = process.cwd()]
 * @returns {Promise}
 */
module.exports = (callback, workingDirectory) => {

    if (!_.isString(workingDirectory))
        workingDirectory = process.cwd();
    const oldWorkingDirectory = process.cwd();
    process.chdir(workingDirectory);
    return callback().then(() => process.chdir(oldWorkingDirectory));
};