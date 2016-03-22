'use strict';

const CacheableDirective      = require('./../common/commands/CacheableDirective');
const UnexpectedExitCodeError = require('./../error/UnexpectedExitCodeError');
const ControlledError         = require('./../error/ControlledError');
const Promise                 = require('bluebird');
const _                       = require('lodash');
const exec                    = require('child_process').exec;
const Queue                   = require('worq');

function pipeProcess(command, reporter) {
    command.stdout.pipe(reporter.getStdoutStream());
    command.stderr.pipe(reporter.getStderrStream());
}

/**
 * Executes the given directive
 * @param {LocatedCommand} command
 * @param {Context} context
 * @param {function} abort Function to call when a critical command fails
 * @returns {Promise}
 */
function executeCommand(command, context, abort) {
    return new Promise(resolve => {
        context.getReporter().onCommandExecuted(command);
        const workingDirectory = command.getWorkingDirectory();
        if (workingDirectory !== null)
            process.chdir(workingDirectory);
        const child = exec(command.getDirective().getString());
        if (context.isVerbose() && command.isVerbose())
            pipeProcess(child, context.getReporter());
        child.on('close', exitcode => {
            if (exitcode !== 0) {
                context.getReporter().onCommandFailed(exitcode, command);
                if (command.isCritical())
                    abort();
            }
            resolve(exitcode);
        });
    });
}

/**
 * Executes the given directive from cache (where possible)
 * @param {LocatedCommand} command
 * @param {Cache} cache
 * @param {Context} context
 * @param {function} abort
 * @returns {Promise}
 */
function executeCached(command, cache, context, abort) {
    let run = () => executeCommand(command, context, abort).then(exitCode => {
        if (exitCode !== 0)
            throw new UnexpectedExitCodeError(exitCode);
    });
    return cache.doCached(run, {
        action:    command.getRelativeDirectory() + ' ' + command.getDirective().getString(),
        input:     command.getDirective().getInput(),
        output:    command.getDirective().getOutput(),
        compress:  true,
        onRestore: () => {
            var workingDirectory = command.getWorkingDirectory();
            if (workingDirectory !== null)
                process.chdir(workingDirectory);
            context.getReporter().onCommandExecuted(command, true);
        },
        onStore:   () => context.getReporter().info('Building cache...')
    }).then(() => 0).catch(err => {
        if (err instanceof UnexpectedExitCodeError) return err.exitCode;
        else throw err;
    });
}

/**
 * Perform the command (possibly cached)
 * @param {LocatedCommand} command
 * @param {Context} context
 * @param {Function} abort
 * @returns {Promise}
 */
function doCommand(command, context, abort) {
    return (command.getDirective() instanceof CacheableDirective) && !context.isDisableCache() ?
        executeCached(command, context.cache, context, abort) :
        executeCommand(command, context, abort);
}

/**
 * Performs an array of commands in series
 * @param {Array.<LocatedCommand>} commands
 * @param {Context} context
 * @returns {Promise}
 */
module.exports = function run(commands, context) {
    const queue = new Queue();
    const abort = () => queue.cancel();
    return queue.run(_.map(commands, command => {
        return () => doCommand(command, context, abort).then(exitcode => {
            if (command.isCritical() && exitcode !== 0)
                throw new new ControlledError('A critical command failed');
        });
    }));
};