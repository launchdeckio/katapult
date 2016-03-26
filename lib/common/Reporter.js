'use strict';

var _                  = require('lodash');
var sprintf            = require('sprintf-js').sprintf;
var path               = require('path');
var chalk              = require('chalk');
var notifier           = require('node-notifier');
var ControlledError    = require('./../error/ControlledError');
const readableInterval = require('./util/readableInterval');
var PrettyError        = require('pretty-error');

class Reporter {

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
     * Reports the execution of an action
     * @param {Action} action
     */
    onActionExecuted(action) {
        console.log(sprintf('\nStarting %s', action.getName()));
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
        var prefix = command.getRelativeDirectory() ? (command.getRelativeDirectory() + ' ') : '';
        var msg    = sprintf('%s$ %s', prefix, command.getDirective().getString());
        if (fromCache)
            msg += ' (from cache)';
        console.log(chalk.grey(msg));
    }

    /**
     * Reports the failure of a command (the command exited with a code other than 0 )
     * @param {int} exitcode
     * @param {LocatedCommand} command
     */
    onCommandFailed(exitcode, command) {
        console.log(chalk.red('\nCommand "' + command.getDirective().getString() + '" failed with exit code ' + exitcode + ''));
    }

    /**
     * Reports when a directory is being cleaned
     * @param {Directory} directory
     */
    onClean(directory) {
        console.log(chalk.cyan('\nclean: ' + directory.getRelativePath()));
    }

    /**
     * Displays some info
     * @param {string} message
     */
    info(message) {
        console.info(chalk.grey(message));
    }

    /**
     * Reports when the build commands are run for a specific directory
     * @param {Directory} directory
     * @param {string} type
     */
    onRunCommands(directory, type) {
        console.log(chalk.grey('\n' + type + ': ' + directory.getRelativePath()));
    }

    /**
     * Gets a stream reader that command stdout will be written to
     * @returns {stream}
     */
    getStdoutStream() {
        return process.stdout;
    }

    /**
     * Gets a stream reader that command stderr will be written to
     * @returns {stream}
     */
    getStderrStream() {
        return process.stderr;
    }
}

module.exports = Reporter;