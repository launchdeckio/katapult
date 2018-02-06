'use strict';

const Cache    = require('johnnycache');
const {assign} = require('lodash');
const arrify   = require('arrify');

const ProcessFailedError  = require('./../error/ProcessFailedError');
const getCacheResultEvent = require('../report/getCacheResultEvent');
const assertPathsSafe     = require('./util/assertPathsSafe');

const events = require('./../events');

const assertCacheOptionsSafe = cacheOptions => {
    if (cacheOptions.input) assertPathsSafe(arrify(cacheOptions.input));
    if (cacheOptions.output) assertPathsSafe(arrify(cacheOptions.output));
};

class Runner {

    constructor(context) {
        this.context = context;
        this.cache   = context.env.workspace.cache;
        this.agent   = context.env.workspace.agent;
    }

    /**
     * Determine whether the given command should be performed with caching enabled
     * @param {LocatedCommand} command
     * @returns {boolean}
     */
    shouldUseCache(command) {
        return (command.directive.cacheOptions) && this.cache instanceof Cache;
    }

    /**
     * Perform the command (cached, where applicable)
     * @param {LocatedCommand} command
     * @returns {Promise}
     */
    doCommand(command) {

        // Use a subContext with the command as the scope
        return this.context.branch({command}).scoped(context => {

            // Run either "executeCached" or "executeCommand"
            return this.shouldUseCache(command) ?
                this.executeCached(context, command) :
                this.executeCommand(context, command);
        });
    }

    /**
     * Executes the given command directly
     * Note the working directory for the process
     * is assumed to be set up correctly already
     *
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Promise} A promise for the termination of the child process. The promise will be rejected if the
     * execution fails.
     */
    async executeCommand(context, command) {

        try {

            return await this.agent.run(context, command);

        } catch (e) {

            // propagate non-zero-exitcode errors as a proper
            // instance type so that queue can be canceled if one occurs
            if (e.code || e.signal)
                throw new ProcessFailedError({
                    code:    e.code,
                    signal:  e.signal,
                    command: command.directive.command
                });

            else throw e;
        }
    }

    /**
     * Executes the given directive with cache enabled
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Promise} Promise for the exitcode of the command
     */
    async executeCached(context, command) {

        const run = () => this.executeCommand(context, command);

        const onRestore = ({cacheableOperation, cachedResult}) =>
            context.emit(events.cacheRestoring({cachedResult, cacheableOperation}));

        this.cache.addListener('restore', onRestore);

        // If the user has defined a "subpath" for the command
        // we need to check that, as the path will be referenced
        // on the host machine when packing the cache files
        if (command.directive.subPath)
            assertPathsSafe([command.directive.subPath]);

        const cacheOptions = assign({}, command.directive.cacheOptions, {
            awaitStore:       true,
            workingDirectory: command.cwd,
            action:           command.identifier,
        });

        assertCacheOptionsSafe(cacheOptions);

        const result = await this.cache.doCached(run, cacheOptions);
        const event  = getCacheResultEvent(context, result);
        if (event) context.emit(event);
        this.cache.removeListener('restore', onRestore);
    }

    /**
     * Performs an array of commands in series
     * @param {Array.<LocatedCommand>} commands
     * @returns {Promise}
     */
    async run(commands) {
        for (const command of commands) {
            await this.doCommand(command);
        }
    }
}

module.exports = Runner;