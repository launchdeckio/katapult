'use strict';

const BuildTreeAction = require('./BuildtreeAction');

/**
 * Base class for actions that run a number of commands
 */
class CommandRunnerAction extends BuildTreeAction {

    getAvailableOptions(cli) {
        return super.getAvailableOptions(cli).concat([
            require('./../cli/options/disableCache'),
            require('./../cli/options/workspace')
        ]);
    }
}

module.exports = CommandRunnerAction;