'use strict';

/**
 * Interface that represents a host machine or environment to run builds in
 */
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
     * Read contents of a file at a given path
     * @param path
     * @returns {Promise.<void>}
     */
    async read(path) { // eslint-disable-line no-unused-vars
        return null;
    }

    /**
     * Write the given string or buffer to a file at a given path
     * @param {String} path
     * @param {String|Buffer} contents
     * @returns {Promise.<void>}
     */
    async write(path, contents) { // eslint-disable-line no-unused-vars
        return null;
    }

    /**
     * Run the given "located command" within the agent
     * The context parameter is assumed to be an instance of
     * the Shipment "Context" class and will be used to
     * send output to in real-time
     *
     * @param {Context} context
     * @param {LocatedCommand} command
     *
     * @returns {*}
     */
    async run(context, command) { // eslint-disable-line no-unused-vars
        return null;
    }
}

module.exports = AgentInterface;