'use strict';

// rewired in test
let fs = require('q-io/fs');

const _        = require('lodash');
const path     = require('path');
const userHome = require('user-home');

const constants          = require('./../constants.json');
const Directory          = require('./Directory');
const readIgnores        = require('./common/util/readIgnores');
const isDirectoryIgnored = require('./common/util/isDirectoryIgnored');

class ScannedBuildTree {

    constructor(root) {
        this.root = root;
    }

    /**
     * Get the max number of iterations for the "processAll" scan procedure
     * @returns {number}
     */
    getMaxIterations() {
        return 100;
    }

    /**
     * @param {Context} context
     * @param {boolean} reverse
     * @param {Function} callback
     * @param {boolean} [scanOnce = false] Whether to prevent rescanning
     * @returns {Promise}
     */
    processAll(context, reverse, callback, scanOnce) {

        let dirs = null;

        const processedDirs = [];

        const scan = () => scanOnce && dirs !== null ?
            Promise.resolve() :
            ScannedBuildTree.scanTree(this.root).then(function (directories) {
                dirs = reverse ? directories.reverse() : directories;
            });

        let iterations = 0;

        const iterate = () => {
            iterations++;
            if (iterations > this.getMaxIterations()) return;
            return scan().then(() => {
                const nextDir = _.find(dirs, dir => !_.includes(processedDirs, dir.absolutePath));
                return _.isUndefined(nextDir) ?
                    Promise.resolve() :
                    Promise.resolve(callback(context, nextDir)).then(function () {
                        processedDirs.push(nextDir.absolutePath);
                        return iterate();
                    });
            });
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
     * Read from the global ignores file (usually ~/.katapultignore_global)
     * @param {string} root
     * @returns {string[]}
     */
    static getGlobalIgnores(root) {
        try {
            return readIgnores(path.join(userHome, constants.globalIgnoreFile), root);
        } catch (e) {
            // File doesn't exist
            return [];
        }
    }

    /**
     * Finds all config files within the given root
     * @param {string} root
     * @returns {Promise.<Array.<string>>}
     */
    static getConfigFiles(root) {

        const configFiles = [];

        // Gets the ignores defined system-wide (usually in ~/.katapultignore_global)
        let globalIgnores = ScannedBuildTree.getGlobalIgnores(root);
        let ignored       = [];

        return fs.listTree(root, (filename, stat) => {
            if (!stat.isDirectory()) {
                const fuzzyBasename = path.basename(filename).toLowerCase();
                if (fuzzyBasename === constants.configFile)
                    configFiles.push(filename);
                else if (fuzzyBasename === constants.ignoreFile)
                    Array.prototype.push.apply(ignored, readIgnores(filename));
                return null;
            } else {
                return !isDirectoryIgnored(filename, ignored.concat(globalIgnores)) ? true : null;
            }
        })
            .then(() => configFiles);
    }

    /**
     * Finds all katapult build directories within the given root
     * @param {string} root
     * @returns {Promise.<Directory[]>}
     */
    static scanTree(root) {
        const configFiles = ScannedBuildTree.getConfigFiles(root);
        const directories = _.map(configFiles, configFile => Directory.fromConfig(root, configFile));
        return Promise.all(directories);
    }
}

module.exports = ScannedBuildTree;