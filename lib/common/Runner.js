'use strict';

const Cache         = require('johnnycache');
const GracefulError = require('shipment').GracefulError;
const _             = require('lodash');
const exec          = require('child_process').exec;
const Queue         = require('worq');

const monitor = require('shipment-monitor-process');
const Process = monitor.Process;

const CacheableDirective      = require('./commands/CacheableDirective');
const UnexpectedExitCodeError = require('./../error/UnexpectedExitCodeError');
const doInWorkingDirectory    = require('./util/doInWorkingDirectory');
const finalizeCacheOp         = require('./../report/reportCacheOp');

const events = require('./../events');

class Runner {

    constructor(context) {
        this.context = context;
        this.cache   = context.workspace.cache;
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
        return this.context.withScope({command},

            // Use the working directory of the given command
            context => doInWorkingDirectory(command.workingDirectory,

                // Run either "executeCached" or "executeCommand"
                this.shouldUseCache(command) ?
                    () => this.executeCached(context, command) :
                    () => this.executeCommand(context, command)));
    }

    /**
     * Executes the given command directly
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Promise} A promise for the termination of the child process. The promise will be rejected if the
     * execution fails.
     */
    executeCommand(context, command) {

        const child = exec(command.directive.command, {maxBuffer: 1024 * 1024});

        let process = new Process(command.directive.command, {
            cwd:    `<build>/${command.relativeDirectory}`,
            stdout: child.stdout,
            stderr: child.stderr
        });

        child.on('close', code => process.done(code));

        return monitor(context, process).catch(e => {
            // propagate non-zero-exitcode errors so that queue can be canceled if that occurs
            if (e.code) {
                throw new UnexpectedExitCodeError(e.code);
            } else {
                throw e;
            }
        });
    }

    /**
     * Executes the given directive with cache enabled
     * @param {Context} context
     * @param {LocatedCommand} command
     * @returns {Promise} Promise for the exitcode of the command
     */
    executeCached(context, command) {

        const run = () => this.executeCommand(context, command);

        const onRestore = (cacheableOperation, cachedResult) =>
            context.emit[events.CACHE_RESTORING]({cachedResult, cacheableOperation});

        const cacheOptions = _.assign({}, command.directive.cacheOptions, {
            awaitStore:       true,
            workingDirectory: command.workingDirectory,
            action:           command.relativeDirectory + ' ' + command.directive.command,
                              onRestore
        });

        return this.cache.doCached(run, cacheOptions)
            .then(result => finalizeCacheOp(context, result));
    }

    /**
     * Performs an array of commands in series
     * @param {Array.<LocatedCommand>} commands
     * @returns {Promise}
     */
    run(commands) {
        const queue = new Queue();
        return queue.run(_.map(commands, command => () => this.doCommand(command).catch(e => {
            if (e instanceof UnexpectedExitCodeError) {
                queue.cancel();
                throw new new GracefulError('A critical command failed');
            } else throw e;
        })));
    }
}

module.exports = Runner;