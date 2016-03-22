'use strict';

var _               = require('lodash');
var sprintf         = require('sprintf-js').sprintf;
var path            = require('path');
var chalk           = require('chalk');
var notifier        = require('node-notifier');
var ControlledError = require('./../error/ControlledError');
var PrettyError     = require('pretty-error');

/**
 * Create new reporter
 * @param {Context} context
 * @constructor
 */
var Reporter = function (context) {
    this.context = context;
};

/**
 * Displays native toast with icon
 * @param {Object} args
 */
var katapultNotify = function (args) {
    return notifier.notify(_.assign({
        'icon': path.join(__dirname, '../../assets/logo-notify.png')
    }, args));
};

/**
 * Reports when an action starts
 * @param {string} action
 */
Reporter.prototype.onAction = function (action) {
    console.log('\n' + action);
};

/**
 * Reports a completed action
 * @param {string} action
 * @param {boolean} [notify=false] Whether to show a toast
 */
Reporter.prototype.onComplete = function (action, notify) {
    console.log('\n' + chalk.green('✓ ' + action) + '\n');
    if (notify)
        katapultNotify({
            title:   action,
            message: 'Katapult action completed'
        });
};

/**
 * Shows a warning message
 * @param {string} message
 */
Reporter.prototype.warn = function (message) {
    console.log('\n' + chalk.yellow(message));
};

/**
 * Reports an error
 * @param {Error} error
 * @param {string} [notify = false] Optional title for a toast to show
 * @param {boolean} [terminate = true] Whether to terminate the process
 */
Reporter.prototype.onError = function (error, notify, terminate) {
    var isControlled = error instanceof ControlledError;
    var color        = isControlled ? chalk.red : chalk.white.bgRed;
    console.log('\n' + color(error.message));
    if (!isControlled) {
        var pe = new PrettyError();
        pe.appendStyle({'pretty-error > header': {display: 'none'}});
        console.log(pe.render(error));
    }
    if (notify) {
        katapultNotify({
            title:   notify,
            message: error.message
        });
    }
    if (typeof terminate === 'undefined' || terminate) {
        process.exit(1);
    }
};

/**
 * Reports the execution of a command
 * @param {LocatedCommand} command
 * @param {boolean} [fromCache = false]
 */
Reporter.prototype.onCommandExecuted = function (command, fromCache) {
    var prefix = command.getRelativeDirectory() ? (command.getRelativeDirectory() + ' ') : '';
    var msg    = sprintf('%s$ %s', prefix, command.getDirective().getString());
    if (fromCache)
        msg += ' (from cache)';
    console.log(chalk.grey(msg));
};

/**
 * Reports the failure of a command (the command exited with a code other than 0 )
 * @param {int} exitcode
 * @param {LocatedCommand} command
 */
Reporter.prototype.onCommandFailed = function (exitcode, command) {
    console.log(chalk.red('\nCommand "' + command.getDirective().getString() + '" failed with exit code ' + exitcode + ''));
};

/**
 * Reports when a directory is cleaned
 * @param {Directory} directory
 */
Reporter.prototype.onClean = function (directory) {
    console.log(chalk.cyan('\nclean: ' + directory.getRelativePath()));
};

/**
 * Displays some info
 * @param {string} message
 */
Reporter.prototype.info = function (message) {
    console.info(chalk.grey(message));
};

/**
 * Reports when the build commands are run for a specific directory
 * @param {Directory} directory
 * @param {string} type
 */
Reporter.prototype.onRunCommands = function (directory, type) {
    console.log(chalk.grey('\n' + type + ': ' + directory.getRelativePath()));
};

/**
 * Gets a stream reader that command stdout will be written to
 * @returns {stream}
 */
Reporter.prototype.getStdoutStream = function () {
    return process.stdout;
};

/**
 * Gets a stream reader that command stderr will be written to
 * @returns {stream}
 */
Reporter.prototype.getStderrStream = function () {
    return process.stderr;
};

module.exports = Reporter;