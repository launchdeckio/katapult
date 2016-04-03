'use strict';

const Cache                   = require('johnnycache');
const CacheableDirective      = require('./../common/commands/CacheableDirective');
const UnexpectedExitCodeError = require('./../error/UnexpectedExitCodeError');
const ControlledError         = require('./../error/ControlledError');
const Promise                 = require('bluebird');
const _                       = require('lodash');
const exec                    = require('child_process').exec;
const Queue                   = require('worq');
const doInWorkingDirectory    = require('./../common/util/doInWorkingDirectory');

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
    shouldPerformCached(command) {
        return (command.directive instanceof CacheableDirective) && this.cache instanceof Cache;
    }

    /**
     * Perform the command (cached, where applicable)
     * @param {LocatedCommand} command
     * @returns {Promise}
     */
    doCommand(command) {
        return doInWorkingDirectory(this.shouldPerformCached(command) ?
                () => this.executeCached(command) :
                () => this.executeCommand(command),
            command.workingDirectory);
    }

    /**
     * Executes the given command directly
     * @param {LocatedCommand} command
     * @returns {Promise} A promise for the termination of the child process. The promise will be rejected if the
     * execution fails.
     */
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            this.context.reporter.onCommandExecuted(command);
            const child = exec(command.directive.command);
            this.context.reporter.pipeProcess(child);
            child.on('close', exitcode => {
                if (exitcode !== 0) {
                    this.context.reporter.onCommandFailed(exitcode, command);
                    reject(new UnexpectedExitCodeError(exitcode));
                }
                resolve();
            });
        });
    }

    /**
     * Executes the given directive with cache enabled
     * @param {LocatedCommand} command
     * @returns {Promise} Promise for the exitcode of the command
     */
    executeCached(command) {
        let run       = () => this.executeCommand(command);
        let onRestore = () => this.context.reporter.onCommandExecuted(command, true);
        // let onStore   = () => this.context.reporter.info('Caching result...');
        return this.cache.doCached(run, _.assign({}, command.directive.cacheOptions, {
            action: command.relativeDirectory + ' ' + command.directive.command,
                    onRestore//,
            // onStore
        })).then(result => this.context.reporter.reportCachedOp(result));
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
                throw new new ControlledError('A critical command failed');
            } else throw e;
        })));
    }
}

module.exports = Runner;