'use strict';

const del = require('del');

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class ClearCache extends Action {

    getContextDefaults(cli) { // eslint-disable-line no-unused-vars
        return {cache: false};
    }

    getAvailableOptions(cli) { // eslint-disable-line no-unused-vars
        return super.getAvailableOptions().concat([
            require('./../cli/options/workspace')
        ]);
    }

    run(context, options) { // eslint-disable-line no-unused-vars
        process.chdir(context.workspace.path);
        return del(constants.cacheFolder);
    }
}

ClearCache.description = 'Clears the build cache in the configured workspace.';

module.exports = ClearCache;