'use strict';

const Action    = require('./../Action');
const constants = require('./../../constants.json');
const del       = require('del');
const path      = require('path');

class ClearCache extends Action {

    getDescription() {
        return "Clears the build cache in the current workspace";
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
        return del(path.join(context.workspace.path, constants.cacheFolder));
    }
}

module.exports = ClearCache;