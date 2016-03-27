'use strict';

const _         = require('lodash');
const path      = require('path');
const Cache     = require('johnnycache');
const defaults  = require('defa');
const constants = require('./../constants.json');

class Workspace {

    constructor(path) {
        this.path = path;
    }

    /**
     * @returns {Cache|null}
     */
    getCache() {
        return this.cache ? this.cache : null;
    }

    /**
     * Create a new workspace based on the given options
     * @param {Object} [options]
     * @returns {Workspace}
     */
    static create(options) {
        defaults(options, {
            basePath: process.cwd(),
            cache:    true
        }, options => {
            return {
                path: path.join(options.basePath, constants.workspace)
            };
        });
        const workspace = new Workspace(options.path);
        if (options.cache) workspace.cache = new Cache({
            workspace: path.join(options.path, constants.cacheFolder)
        });
        return workspace;
    }
}

module.exports = Workspace;