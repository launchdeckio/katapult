'use strict';

// rewired in test
let fs = require('q-io/fs');

const _        = require('lodash');
const path     = require('path');
const userHome = require('user-home');

const constants          = require('./../constants.json');
const BuildTree          = require('./BuildTree');
const Directory          = require('./Directory');
const readIgnores        = require('./common/util/readIgnores');
const isDirectoryIgnored = require('./common/util/isDirectoryIgnored');

class ScannedBuildTree extends BuildTree {

    constructor(root) {
        super();
        this.root = root;
    }

    /**
     * Scan for directories with a .katapult.yml file
     * @returns {Promise.<Directory[]>}
     */
    scan() {
        return ScannedBuildTree.scanTree(this.root);
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
        return ScannedBuildTree.getConfigFiles(root).then(configFiles => {
            return Promise.all(_.map(configFiles, configFile => {
                return Directory.fromConfig(root, path.dirname(configFile));
            }));
        });
    }
}

module.exports = ScannedBuildTree;