'use strict';

const defaults         = require('defa');
const sprintf          = require('sprintf-js').sprintf;
const path             = require('path');
const chalk            = require('chalk');
const readableInterval = require('./util/readableInterval');
const filesize         = require('filesize');

const BaseReporter = require('shipment').Reporter;

class Reporter extends BaseReporter {

    constructor() {
        super();
        this.stdout = process.stdout;
        this.stderr = process.stderr;
    }

    doToast(options) {
        super.doToast(defaults(options, {
            'title': 'Katapult',
            'icon':  path.join(__dirname, '../../assets/logo-notify.png')
        }));
    }

    /**
     * Reports the execution of a command
     * @param {LocatedCommand} command
     */
    onCommandExecuted(command) {
        var prefix = command.relativeDirectory ? (command.relativeDirectory + ' ') : '';
        var msg    = sprintf('%s$ %s', prefix, command.directive.command);
        console.log(chalk.grey(msg));
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