'use strict';

const _         = require('lodash');
const path      = require('path');
const defaults  = require('defa');
const constants = require('./../constants.json');

class Workspace {

    constructor(path) {
        this.path = path;
    }

    /**
     * Create a new workspace based on the given options
     * @param {Object} [options]
     * @returns {Workspace}
     */
    static create(options) {
        defaults(options, {
            basePath: process.cwd(),
        }, {
            path: options => path.join(options.basePath, constants.workspace)
        });
        return new Workspace(options.path);
    }
}

module.exports = Workspace;