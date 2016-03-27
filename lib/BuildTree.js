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

class BuildTree {

    constructor(root) {
        this.root = root;
    }

    /**
     * Get the max number of iterations for the "processAll" iteration scanner
     * @returns {number}
     */
    getMaxIterations() {
        return 100;
    }

    /**
     * @param {Context} context
     * @param {boolean} reverse
     * @param {function.<Promise>} callback
     * @param {boolean} [scanOnce = false] Whether to prevent rescanning
     * @returns {Promise}
     */
    processAll(context, reverse, callback, scanOnce) {

        var dirs          = null,
            processedDirs = [];

        const scan = () => scanOnce && dirs !== null ?
            Promise.resolve() :
            BuildTree.scanTree(this.root).then(function (directories) {
                dirs = reverse ? directories.reverse() : directories;
            });

        let iterations = 0;

        const iterate = () => {
            iterations++;
            if (iterations > this.getMaxIterations()) return;
            return scan().then(function () {
                var nextDir = _.find(dirs, dir => !_.includes(processedDirs, dir.getAbsolutePath()));
                return _.isUndefined(nextDir) ?
                    Promise.resolve() :
                    Promise.resolve(callback(context, nextDir)).then(function () {
                        processedDirs.push(nextDir.getAbsolutePath());
                        return iterate();
                    });
            })
        };

        return iterate();
    }

    /**
     * Runs the install commands in order of ascending depth
     * @param {Context} context
     * @returns {Promise}
     */
    install(context) {
        return this.processAll(context, false, (context, directory) => directory.install(context));
    }

    /**
     * Runs the build commands in order of descending depth
     * @param {Context} context
     * @returns {Promise}
     */
    build(context) {
        return this.processAll(context, true, (context, directory) => directory.build(context), true);
    }

    /**
     * Cleans (purges) the build tree based on the purge globs in order of descending depth
     * @param {Context} context
     * @returns {Promise}
     */
    clean(context) {
        return this.processAll(context, true, (context, directory) => directory.clean(context), true);
    }

    /**
     * Finds all config files within the given root
     * @param {string} root
     * @returns {Promise.<Array.<string>>}
     */
    static getConfigFiles(root) {

        var configFiles = [];
        var ignored     = [];

        return fs.listTree(root, (filename, stat) => {
            if (!stat.isDirectory()) {
                var fuzzyBasename = path.basename(filename).toLowerCase();
                if (fuzzyBasename === constants.configFile)
                    configFiles.push(filename);
                else if (fuzzyBasename === constants.ignorefile)
                    Array.prototype.push.apply(ignored, BuildTree.parseIgnores(filename));
                return null;
            } else
                return BuildTree.shouldTraverseDirectory(filename, ignored) ? true : null;
        }).then(() => configFiles);
    }

    /**
     * Finds all katapult build directories within the given root
     * @param {string} root
     * @returns {Promise.<Array.<string>>}
     */
    static scanTree(root) {
        return BuildTree.getConfigFiles(root)
            .then(configFiles => Promise.all(_.map(configFiles, fname => {
                var dir = path.dirname(fname);
                return Directory.create(path.relative(root, dir), dir);
            })));
    }

    /**
     * Determines whether the given directory should be traversed
     * @param {string} relativePath
     * @param {string[]} ignores
     * @returns {boolean}
     */
    static shouldTraverseDirectory(relativePath, ignores) {
        return !_.includes(BuildTree.globalIgnores, path.basename(relativePath)) && !_.reduce(ignores,
                (isIgnored, ignore) => {
                    let negating = _.startsWith(ignore, '!');
                    return (minimatch(relativePath, negating ? ignore.substring(1) : ignore)) ? !negating : isIgnored;
                }, false);
    }

    /**
     * Read and process the ignore globs from an ignore file
     * @param {string} filename
     * @returns {Array.<string>}
     */
    static parseIgnores(filename) {
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
    }
}

/**
 * Array of folders to ignore when scanning directories
 * @type {string[]}
 */
BuildTree.globalIgnores = [
    ".git",
    ".katapult"
];

module.exports = BuildTree;