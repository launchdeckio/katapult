'use strict';

// rewired in test
let fs = require('q-io/fs');

const constants = require('./../constants.json');
const globUtils = require('./common/util/globUtils');
const Directory = require('./Directory');
const _         = require('lodash');
const path      = require('path');
const classicFs = require('fs');
const minimatch = require('minimatch');
const Promise   = require('bluebird');

/**
 * @param {string} root
 * @constructor
 */
var BuildTree = function (root) {
    this.root = root;
};

/**
 * Array of folders to ignore when scanning directories
 * @type {string[]}
 */
BuildTree.globalIgnores = [
    ".git",
    ".katapult"
];

/**
 * @param {Context} context
 * @param {boolean} reverse
 * @param {function.<Promise>} callback
 * @param {boolean} [scanOnce = false] Whether to prevent rescanning
 * @returns {Promise}
 */
BuildTree.prototype.processAll = function (context, reverse, callback, scanOnce) {

    var dirs          = null,
        processedDirs = [];

    var scan = function () {
        return scanOnce && dirs !== null ?
            Promise.resolve() :
            BuildTree.scanTree(this.root).then(function (directories) {
                dirs = reverse ? directories.reverse() : directories;
            });
    }.bind(this);

    var next = function () {
        return scan().then(function () {
            var nextDir = _.find(dirs, function (dir) {
                return !_.includes(processedDirs, dir.getAbsoluteTargetPath());
            });
            return _.isUndefined(nextDir) ?
                Promise.resolve() :
                Promise.resolve(callback(context, nextDir)).then(function () {
                    processedDirs.push(nextDir.getAbsoluteTargetPath());
                    return next();
                });
        });
    };
    return next();

};

/**
 * Gets the root directory
 * @param {boolean} loose If true, will generate an "empty" config if the root directory does not have a config file
 * @returns {Promise.<Directory>}
 * @throws Error When the config file does not exists and loose is set to false
 */
BuildTree.prototype.getRootDirectory = function (loose) {
    return Directory.create('', this.root, loose);
};

/**
 * Runs the install commands in order of ascending depth
 * @param {Context} context
 * @returns {Promise}
 */
BuildTree.prototype.install = function (context) {
    return this.processAll(context, false, function (context, directory) {
        return directory.install(context);
    });
};

/**
 * Runs the build + clean commands in order of descending depth
 * @param {Context} context
 * @returns {Promise}
 */
BuildTree.prototype.build = function (context) {
    return this.processAll(context, true, function (context, directory) {
        return directory.build(context);
    }, true);
};

/**
 * Runs the build + clean commands in order of descending depth
 * @param {Context} context
 * @returns {Promise}
 */
BuildTree.prototype.clean = function (context) {
    return this.processAll(context, true, function (context, directory) {
        return directory.clean(context);
    }, true);
};

/**
 * Read and process the ignore globs from an ignore file
 * @param {string} filename
 * @returns {Array.<string>}
 */
var parseIgnores = function (filename) {
    let dirname    = path.dirname(filename);
    let rawIgnores = classicFs.readFileSync(filename, 'utf8')
        .replace(/\//g, path.sep)
        .trim()
        .split(/(\r|\n)+/);
    return _(globUtils.flattenGlobArray(_.filter(rawIgnores, ignore => ignore && !/^(\r|\n)+$/.test(ignore))))
        .map(glob => {
            let negating = _.startsWith(glob, '!');
            return (negating ? '!' : '') + path.join(dirname, negating ? glob.substring(1) : glob);
        }).value();
};

/**
 * Determines whether the given directory should be traversed
 * @param {string} relativePath
 * @param {string[]} ignores
 * @returns {boolean}
 */
const shouldTraverseDirectory = function (relativePath, ignores) {
    return !_.includes(BuildTree.globalIgnores, path.basename(relativePath)) && !_.reduce(ignores,
            (isIgnored, ignore) => {
                let negating = _.startsWith(ignore, '!');
                return (minimatch(relativePath, negating ? ignore.substring(1) : ignore)) ? !negating : isIgnored;
            }, false);
};

/**
 * Finds all config files within the given root
 * @param {string} root
 * @returns {Promise.<Array.<string>>}
 */
BuildTree.getConfigFiles = function (root) {

    var configFiles = [];
    var ignored     = [];

    return fs.listTree(root, function guard(filename, stat) {
        if (!stat.isDirectory()) {
            var fuzzyBasename = path.basename(filename).toLowerCase();
            if (fuzzyBasename === constants.configFile)
                configFiles.push(filename);
            else if (fuzzyBasename === constants.ignorefile)
                Array.prototype.push.apply(ignored, parseIgnores(filename));
            return null;
        } else
            return shouldTraverseDirectory(filename, ignored) ? true : null;
    }).then(function () {
        return configFiles;
    });
};

/**
 * Finds all katapult build directories within the given root
 * @param {string} root
 * @returns {Promise.<Array.<string>>}
 */
BuildTree.scanTree = function (root) {
    return BuildTree.getConfigFiles(root)
        .then(function (configFiles) {
            return Promise.all(_.map(configFiles, function (fname) {
                var dir = path.dirname(fname);
                return Directory.create(path.relative(root, dir), dir);
            }));
        });
};

module.exports = BuildTree;