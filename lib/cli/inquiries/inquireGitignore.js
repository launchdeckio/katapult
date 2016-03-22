'use strict';

var fs                = require('q-io/fs');
var path              = require('path');
var _                 = require('lodash');
var sprintf           = require('sprintf-js').sprintf;
var chalk             = require('chalk');
var inquireAsPromised = require('./inquireAsPromised');

/**
 * Traverses all parent directories until one that contains a .git folder is encountered
 * @param {string} filename
 * @return {Promise.<String|null>}
 */
var getGitRoot = function (filename) {
    var tryDirectory = function (dirname) {
        return fs.exists(path.join(dirname, '.git'))
            .then(function (exists) {
                if (!exists) {
                    var parent = path.dirname(dirname);
                    return parent != dirname ? tryDirectory(parent) : null;
                } else
                    return dirname;
            });
    };
    return tryDirectory(path.dirname(filename));
};

/**
 * Gets the ignores specified by the .gitignore file in the provided git root
 * @param gitRoot
 * @returns {Promise.<Array.<String>>}
 */
var getGitignores = function (gitRoot) {
    var ignoresFile = path.join(gitRoot, '.gitignore');
    return fs.exists(ignoresFile)
        .then(function (exists) {
            return !exists ? [] : fs.read(ignoresFile).then(function (contents) {
                return contents.split(/\r?\n/);
            });
        });
};

/**
 * Asks to add the provided glob to the .gitignore file in the provided git root
 * @param gitRoot
 * @param glob
 * @returns {Promise}
 */
var inquireToAdd = function (gitRoot, glob) {
    var ignoresFile = path.join(gitRoot, '.gitignore');
    return inquireAsPromised({
        type:    'confirm',
        message: sprintf('\nAdd %s to %s?', chalk.yellow(glob), chalk.yellow(ignoresFile))
    }).then(function (add) {
        if (add) return fs.append(ignoresFile, '\n' + glob + '\n');
    });
};

/**
 * Asks to add the filenames to the .gitignore file of a git repo represented by any of its containing folders
 * @param filename
 * @returns {Promise}
 */
module.exports = function (filename) {
    return getGitRoot(filename)
        .then(gitRoot => {
            if (gitRoot !== null) {
                return getGitignores(gitRoot)
                    .then(gitignores => {
                        var glob = path.relative(gitRoot, filename).replace(/\\/g, '/');
                        if (!_.includes(gitignores, glob))
                            return inquireToAdd(gitRoot, glob);
                    });
            }
        });
};