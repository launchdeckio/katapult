'use strict';

const Action    = require('./../Action');
const constants = require('./../../constants.json');
const del       = require('del');
const path      = require('path');

class ClearCache extends Action {

    getDescription() {
        return "Clears the build cache in the current workspace";
    }

    parseArgv(argv) {
        return {workspace: process.cwd()};
    }

    run(context, options) {
        return del(path.join(options.workspace, constants.workspace, constants.cacheFolder));
    }
}

module.exports = ClearCache;