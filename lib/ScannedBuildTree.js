'use strict';

const _        = require('lodash');
const path     = require('path');
const userHome = require('user-home');

const constants          = require('./../constants.json');
const BuildTree          = require('./BuildTree');
const Directory          = require('./Directory');
const deepLs             = require('./common/util/deepLs');
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
    scan(context) {
        return ScannedBuildTree.scanTree(context, this.root);
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
     * @param {Context} context
     * @param {string} root
     * @returns {Promise.<Array.<string>>}
     */
    static async getConfigFiles(context, root) {

        const configFiles = [];

        // Gets the ignores defined system-wide (usually in ~/.katapultignore_global)
        let globalIgnores = ScannedBuildTree.getGlobalIgnores(root);
        let ignored       = [];

        const ls = path => context.agent.dir(path);

        const guard = (absolutePath, stat) => {
            if (!stat.isDirectory()) {
                const fuzzyBasename = path.basename(absolutePath).toLowerCase();
                if (fuzzyBasename === constants.configFile)
                    configFiles.push(absolutePath);
                else if (fuzzyBasename === constants.ignoreFile)
                    ignored.push(...readIgnores(absolutePath));
            } else
                return !isDirectoryIgnored(absolutePath, ignored.concat(globalIgnores));
        };

        await deepLs(root, ls, guard);

        return configFiles;
    }

    /**
     * Finds all katapult build directories within the given root
     * @param {Context} context
     * @param {string} root
     * @returns {Promise.<Directory[]>}
     */
    static async scanTree(context, root) {
        const configFiles = await ScannedBuildTree.getConfigFiles(context, root);
        return Promise.all(_.map(configFiles, configFile => {
            return Directory.fromConfig(root, path.dirname(configFile));
        }));
    }
}

module.exports = ScannedBuildTree;