'use strict';

const _                = require('lodash');
const sprintf          = require('sprintf-js').sprintf;
const path             = require('path');
const chalk            = require('chalk');
const notifier         = require('node-notifier');
const ControlledError  = require('./../error/ControlledError');
const readableInterval = require('./util/readableInterval');
const PrettyError      = require('pretty-error');
const filesize         = require('filesize');

class Reporter {

    constructor() {
        this.stdout = process.stdout;
        this.stderr = process.stderr;
    }

    /**
     * Display native toast with icon
     * @param {Object} options
     */
    static doToast(options) {
        return notifier.notify(_.defaults(options, {
            'title': 'Katapult',
            'icon':  path.join(__dirname, '../../assets/logo-notify.png')
        }));
    }

    /**
     * Reports the completion of an action
     * @param {Action} action
     * @param {Number} [uptime] The time since the action was started
     */
    onActionCompleted(action, uptime) {
        let message = sprintf('✓ %s completed', action.getName());
        if (uptime) message += sprintf(' (%s)', readableInterval(uptime));
        console.log('\n' + chalk.green(message) + '\n');
        if (uptime > 1000)
            Reporter.doToast({message});
    }

    /**
     * Reports an error
     * @param {Action} action
     * @param {Error} error
     * @param {Number} [uptime] The time since the action was started
     */
    onActionFailed(action, error, uptime) {
        var isControlled = error instanceof ControlledError;
        var color        = isControlled ? chalk.red : chalk.white.bgRed;
        console.log('\n' + color(error.message));
        if (!isControlled) {
            var pe = new PrettyError();
            pe.appendStyle({'pretty-error > header': {display: 'none'}});
            console.log(pe.render(error));
        }
        if (uptime > 1000)
            Reporter.doToast({message: 'An error occurred'});
    }

    /**
     * Shows a warning message
     * @param {string} message
     */
    warn(message) {
        console.log('\n' + chalk.yellow(message));
    }

    /**
     * Reports the execution of a command
     * @param {LocatedCommand} command
     * @param {boolean} [fromCache = false]
     */
    onCommandExecuted(command, fromCache) {
        var prefix = command.relativeDirectory ? (command.relativeDirectory + ' ') : '';
        var msg    = sprintf('%s$ %s', prefix, command.directive.command);
        if (fromCache)
            msg += ' (from cache)';
        console.log(chalk.grey(msg));
    }

    /**
     * Report the result of a cache save / extract
     * @param {RestoredFromCache|SavedToCache|CacheableOperation} result
     */
    reportCachedOp(result) {
        let msg;
        if (result.runtime && !result.action)
            msg = sprintf('Restored from cache in %s', readableInterval(result.runtime));
        else if (result.runtime)
            msg = sprintf('Operation took %s, result will be saved to cache.',
                readableInterval(result.runtime));
        if (result.operationRuntime && result.storageRuntime)
            msg = sprintf('%s%s saved to cache in %s (operation itself took %s)',
                filesize(result.cachedResult.fileSize),
                result.cachedResult.compressed ? ' (compressed)' : '',
                readableInterval(result.storageRuntime),
                readableInterval(result.operationRuntime));
        if (msg) console.log(chalk.grey(msg));
    }

    /**
     * Reports the failure of a command (the command exited with a code other than 0 )
     * @param {int} exitcode
     * @param {LocatedCommand} command
     */
    onCommandFailed(exitcode, command) {
        console.log(chalk.red('\nCommand "' + command.directive.string + '" failed with exit code ' + exitcode + ''));
        process.exit(1);
    }

    /**
     * Reports when a directory is being cleaned
     * @param {Directory} directory
     */
    onClean(directory) {
        console.log(chalk.cyan('\nclean: ' + directory.relativePath));
    }

    /**
     * Displays some info
     * @param {string} message
     */
    info(message) {
        console.info(chalk.grey(message));
    }

    /**
     * Reports when the build commands are Runner for a specific directory
     * @param {Directory} directory
     * @param {string} type
     */
    onRunCommands(directory, type) {
        console.log(chalk.grey('\n' + type + ': ' + directory.relativePath));
    }

    /**
     * Register the standard and error outputs of the given child process
     * @param child
     */
    pipeProcess(child) {
        child.stdout.pipe(this.stdout);
        child.stderr.pipe(this.stderr);
    }
}

module.exports = Reporter;