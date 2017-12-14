'use strict';

const BuildTree   = require('./BuildTree');
const Directory   = require('./Directory');
const BuildConfig = require('./BuildConfig');

/**
 * BuildTree that instead of scanning for .katapult.yml
 * runs based on a predefined configuration
 */
class PreconfiguredBuildTree extends BuildTree {

    /**
     * @param {Directory[]} dirs
     */
    constructor(dirs) {
        super();
        this.dirs = dirs;
    }

    scan(context) { // eslint-disable-line no-unused-vars
        return this.dirs;
    }

    /**
     * From the given root path and automation config (.katapult.yml file content),
     * create a PreconfiguredBuildTree instance
     * @param {string} root
     * @param {string} yaml
     * @returns {PreconfiguredBuildTree}
     */
    static create(root, yaml) {
        const config = BuildConfig.fromYaml(yaml);
        const dir    = new Directory('', root, config);
        return new PreconfiguredBuildTree([dir]);
    }
}


module.exports = PreconfiguredBuildTree;