'use strict';

const Cache                   = require('johnnycache');
const CacheableDirective      = require('./../common/commands/CacheableDirective');
const UnexpectedExitCodeError = require('./../error/UnexpectedExitCodeError');
const ControlledError         = require('./../error/ControlledError');
const Promise                 = require('bluebird');
const _                       = require('lodash');
const exec                    = require('child_process').exec;
const Queue                   = require('worq');

function pipeProcess(command, reporter) {
    command.stdout.pipe(reporter.stdout);
    command.stderr.pipe(reporter.stderr);
}

/**
 * Executes the given directive
 * @param {LocatedCommand} command
 * @param {Context} context
 * @returns {Promise} A promise for the termination of the child process. The promise will be rejected if the
 * execution fails.
 */
function executeCommand(command, context) {
    return new Promise((resolve, reject) => {
        context.reporter.onCommandExecuted(command);
        if (command.workingDirectory !== null)
            process.chdir(command.workingDirectory);
        const child = exec(command.directive.string);
        pipeProcess(child, context.reporter);
        child.on('close', exitcode => {
            if (exitcode !== 0) {
                context.reporter.onCommandFailed(exitcode, command);
                reject(new UnexpectedExitCodeError(exitcode));
            }
            resolve();
        });
    });
}

/**
 * Executes the given directive from cache (where possible)
 * @param {LocatedCommand} command
 * @param {Cache} cache
 * @param {Context} context
 * @returns {Promise} Promise for the exitcode of the command
 */
function executeCached(command, cache, context) {
    let run       = () => executeCommand(command, context);
    let onRestore = () => {
        var workingDirectory = command.workingDirectory;
        if (workingDirectory !== null)
            process.chdir(workingDirectory);
        context.reporter.onCommandExecuted(command, true);
    };
    let onStore   = () => context.reporter.info('Building cache...');
    return cache.doCached(run, {
        action:   command.relativeDirectory + ' ' + command.directive.string,
        input:    command.directive.input,
        output:   command.directive.output,
        ttl:      command.directive.ttl,
        compress: true,
                  onRestore,
                  onStore
    });
}

/**
 * Perform the command (possibly cached)
 * @param {LocatedCommand} command
 * @param {Context} context
 * @returns {Promise}
 */
function doCommand(command, context) {
    return (command.directive instanceof CacheableDirective) && context.workspace.cache instanceof Cache ?
        executeCached(command, context.workspace.cache, context) :
        executeCommand(command, context);
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
    return queue.run(_.map(commands, command => () => doCommand(command, context).catch(e => {
        if (e instanceof UnexpectedExitCodeError) {
            abort();
            throw new new ControlledError('A command failed');
        } else throw e;
    })));
};