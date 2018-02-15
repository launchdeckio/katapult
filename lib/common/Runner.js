'use strict';

const {CacheFlow, Intent} = require('johnnycache');

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
     * Executes the given command directly.
     * Note the working directory for the process
     * is assumed to be set up correctly already
     * @param {Context} context Sub-context to use
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
     * Create step spec for the given command
     * @param {LocatedCommand} command
     * @returns {Object}
     */
    createCacheFlowSpec(command) {
        const run            = context => this.executeCommand(context, command);
        let cacheableOptions = null, isIntermediate = false;
        if (command.directive.cacheOptions) {
            const {intermediate, ...directiveOptions} = command.directive.cacheOptions;
            isIntermediate                            = intermediate;
            cacheableOptions                          = {
                ...directiveOptions,
                workingDirectory: command.cwd,
                action:           command.identifier,
            };
        }
        const intent = new Intent(run, cacheableOptions);
        const wrap   = this.wrapper(command);
        return {intent, isIntermediate, wrap};
    }

    withCommandScope(command, fn) {
        // TODO better (handpicked) context scoped based on command
        return this.context.branch({command}).scoped(fn);
    }

    wrapper(command) {
        return doStep => this.withCommandScope(command, async context => {
            const onRestore = ({result: {fileSize}}) => {
                context.emit(events.cacheRestoring({fileSize}));
            };
            this.cache.addListener('restore', onRestore);
            const result = await doStep(context);
            const event  = getCacheResultEvent(result);
            if (event) context.emit(event);
            this.cache.removeListener('restore', onRestore);
        });
    }

    /**
     * Performs an array of commands in series
     * @param {Array.<LocatedCommand>} commands
     * @returns {Promise}
     */
    async run(commands) {
        if (this.cache) {
            // If we're using a cache, use a CacheFlow instance
            // for the proper handling of "intermediate" steps
            const specs     = commands.map(command => {
                assertDirectiveSafe(command.directive);
                return this.createCacheFlowSpec(command);
            });
            const cacheFlow = new CacheFlow({cache: this.cache});
            await cacheFlow.add(specs);
            await cacheFlow.run();
        } else {
            for (const command of commands) {
                await this.withCommandScope(command, context => {
                    return this.executeCommand(context, command);
                });
            }
        }
    }
}

module.exports = Runner;