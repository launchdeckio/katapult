'use strict';

const Action    = require('./../Action');
const constants = require('./../../constants.json');
const del       = require('del');

class ClearCache extends Action {

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
ClearCache.description = "Clears the build cache in the configured workspace.";

module.exports = ClearCache;