'use strict';

const _       = require('lodash');
const Context = require('./common/Context');
const Promise = require('bluebird');
const sprintf = require('sprintf-js').sprintf;

class Action {

    /**
     * Perform the action
     * @param {Context} context
     * @param {Object} options
     */
    run(context, options) {
        throw new Error(sprintf('Run method not implemented for %s', this.getName()));
    }

    /**
     * By default, deduce the name of the action from the class name
     * @returns {String|null}
     */
    getName() {
        const matches = /(\w+)(?:Action)?/.exec(this.constructor.name);
        return matches ? _.kebabCase(matches[1]) : null;
    }

    /**
     * Get the command description
     * @returns {String}
     */
    getDescription() {
        throw new Error(sprintf('No command description defined for %s', this.getName()));
    }

    /**
     * Provision the yargs instance with this command's options
     * @param yargs
     */
    describeCommand(yargs) {
        _.forEach(this.getAvailableOptions(), option => option.transformYargs(yargs));
        return yargs;
    }

    /**
     * Invoked when the action has completed successfully
     * @param {Context} context
     */
    onSuccess(context) {
        context.getReporter().onActionCompleted(this, context.getUptime());
    }

    /**
     * Invoked when an error is thrown during the execution of the action
     * @param {Context} context
     * @param {Error} error
     */
    onError(context, error) {
        context.getReporter().onActionFailed(this, error, context.getUptime());
    }

    /**
     * Get the available options for this action
     * @returns {Option[]}
     */
    getAvailableOptions() {
        return [
            require('./cli/options/verbose')
        ];
    }

    /**
     * Run the command
     * @param argv
     */
    executeCommand(argv) {
        const context = Context.createCliContext();
        _.forEach(this.getAvailableOptions(), option => option.transformContext(context, argv));
        const options = this.parseArgv(argv);
        context.getReporter().onActionExecuted(this);
        // Had to wrap this in Bluebird's Promise.resolve to ensure the presence of the "done" method
        return Promise.resolve(this.run(context, options))
            .then(() => this.onSuccess(context))
            .catch(e => this.onError(context, e))
            .done();
    }

    /**
     * Turn the argv object into an options object
     * @param argv
     * @returns {Object}
     */
    parseArgv(argv) {
        return {};
    }

    /**
     * Register the action into the yargs configuration
     * @param yargs
     */
    register(yargs) {
        return yargs.command(
            this.getName(),
            this.getDescription(),
            yargs => this.describeCommand(yargs),
            argv => this.executeCommand(argv)
        );
    }
}

module.exports = Action;