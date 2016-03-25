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
        // take no arguments by default
    }

    onSuccess(context) {
        const message = sprintf('%s completed successfully', this.getName());
        return context.getReporter().onComplete(message, context.getUptime() > 2000);
    }

    onError(context, e) {
        const notify = context.getUptime() > 2000 ? sprintf('%s failed', this.getName()) : false;
        context.getReporter().onError(e, notify);
    }

    /**
     * Run the command
     * @param argv
     */
    executeCommand(argv) {
        const context = Context.createCliContext();
        const options = this.getOptions(argv);
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
    getOptions(argv) {
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