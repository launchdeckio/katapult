'use strict';

const UnexpectedExitCodeError = require('./../error/UnexpectedExitCodeError');
const GracefulError           = require('shipment').GracefulError;
const Promise                 = require('bluebird');
const _                       = require('lodash');
const exec                    = require('child_process').exec;
const Queue                   = require('worq');
const doInWorkingDirectory    = require('./../common/util/doInWorkingDirectory');

class Runner {

    constructor(context) {
        this.context = context;
    }

    /**
     * Perform the command
     * @param {LocatedCommand} command
     * @returns {Promise}
     */
    doCommand(command) {
        if (this.context.preview) {
            this.context.reporter.onCommandExecuted(command);
            return Promise.resolve();
        } else
            return doInWorkingDirectory(() => this.executeCommand(command), command.workingDirectory);
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
            const child = exec(command.directive.command, {
                maxBuffer: 1024 * 1024
            });
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