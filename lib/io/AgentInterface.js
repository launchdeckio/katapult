'use strict';

class AgentInterface {

    /**
     * Get a list of directories at the given path
     * @param {string} path
     * @returns {{name, isDirectory}[]}
     */
    async dir(path) { // eslint-disable-line no-unused-vars
        return [];
    }

    /**
     * Run the given "located command" within the agent
     * @param {LocatedCommand} command
     * @returns {*}
     */
    async run(command) { // eslint-disable-line no-unused-vars
        return null;
    }
}

module.exports = AgentInterface;