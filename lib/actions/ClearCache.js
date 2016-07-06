'use strict';

const Action    = require('./../Action');
const constants = require('./../../constants.json');
const del       = require('del');

class ClearCache extends Action {

    getDescription() {
        return "Clears the build cache in the configured workspace";
    }

    getContextDefaults() {
        return {cache: false};
    }

    getAvailableOptions() {
        return super.getAvailableOptions().concat([
            require('./../cli/options/workspace')
        ]);
    }

    run(context, options) {
        process.chdir(context.workspace.path);
        return del(constants.cacheFolder);
    }
}

module.exports = ClearCache;