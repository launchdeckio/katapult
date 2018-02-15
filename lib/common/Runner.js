'use strict';

const {Intent} = require('johnnycache');

const ProcessFailedError  = require('./../error/ProcessFailedError');
const getCacheResultEvent = require('../support/getCacheResultEvent');
const assertDirectiveSafe = require('./util/assertDirectiveSafe');

const events = require('./../events');

class Runner {

    constructor(context) {
        this.context = context;
    }

    get workspace() {
        return this.context.env.workspace;
    }

    get cache() {
        return this.workspace.cache;
    }

    get agent() {
        return this.workspace.agent;
    }

    /**
     * Determine whether the given command should be performed with caching enabled
     * @param {LocatedCommand} command
     * @returns {boolean}
     */
    shouldUseCache(command) {
        return (command.directive.cacheOptions) && this.cache;
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
     * Create cache runner intent for the
     * given command
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Cache.Intent}
     */
    createIntent(context, command) {
        return new Intent(() => this.executeCommand(context, command), {
            ...command.directive.cacheOptions,
            workingDirectory: command.cwd,
            action:           command.identifier,
        });
    }

    /**
     * Emit the "restore" cache lifecycle event
     * on the given context for the duration of the callback fn
     * @param {Context} context
     * @param {Function} fn
     * @returns {*}
     */
    async withEventPropagation(context, fn) {

        const onRestore = ({result: {fileSize}}) =>
            context.emit(events.cacheRestoring({fileSize}));

        this.cache.addListener('restore', onRestore);

        try {
            return await fn();
        } finally {
            this.cache.removeListener('restore', onRestore);
        }
    }

    /**
     * Executes the given directive with cache enabled
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Promise} Promise for the exitcode of the command
     */
    async executeCached(context, command) {

        assertDirectiveSafe(command.directive);

        const intent = this.createIntent(context, command);

        await this.withEventPropagation(context, async () => {
            const result = await this.cache.run(intent);
            const event  = getCacheResultEvent(result);
            if (event) context.emit(event);
        });
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