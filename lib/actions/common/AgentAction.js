'use strict';

const Action = require('../../Action');

/**
 * Base class for actions that execute IO operations through an agent
 * This class assigns the "agent" property on the context options,
 * as specified in the arguments passed when the action was invoked
 * (native node API only)
 */
class AgentAction extends Action {

    parseContextArgs(args, cli) {
        const options = super.parseContextArgs(args, cli);
        options.agent = args.agent;
        return options;
    }
}

module.exports = AgentAction;