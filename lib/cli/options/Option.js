'use strict';

var _ = require('lodash');

/**
 * @name YargsTransformFunction
 * @function
 * @param {Object} yargs The yargs object
 * @return {Object} The transformed yargs object
 */

/**
 * @name ContextTransformFunction
 * @function
 * @param {Context} context The context object
 * @param {Object} argv The argv object, as produced by yargs
 * @return {Context} The modified context
 */

/**
 * Represents a CLI option
 * @param {YargsTransformFunction} transformYargs A function that adds the relevant options and aliases to the yargs object
 * @param {ContextTransformFunction} transformContext A function that transforms the Context object based on the argv object
 * @constructor
 */
var Option = function (transformYargs, transformContext) {
    this.transformYargs   = transformYargs;
    this.transformContext = transformContext;
};

/**
 * Creates a simple flag option
 * @param {string} flag
 * @param {string} [description]
 * @param {string} [shorthand]
 * @returns {Option}
 */
Option.createSimpleFlag = function (flag, description, shorthand) {
    return new Option(function (yargs) {
        yargs = yargs.count(flag);
        if (description)
            yargs = yargs.describe(flag, description);
        if (shorthand)
            yargs = yargs.alias(shorthand, flag);
        return yargs;
    }, function (context, argv) {
        context.options[flag] = argv[flag];
        return context;
    });
};

/**
 * Represents a stream that exposes the provided array of CLI options
 * @param {Option[]} options
 * @constructor
 */
var OptionStream = function (options) {
    this.options = options;
};

/**
 * Add the relevant options and aliases to the yargs object
 * @param {Object} yargs The yargs object
 * @returns {Object} The transformed yargs object
 */
OptionStream.prototype.transformYargs = function (yargs) {
    _.forEach(this.options, function (option) {
        option.transformYargs(yargs);
    });
    return yargs;
};

/**
 * Transform the Context object based on the argv object
 * @param {Context} context The context object
 * @param {Object} argv The argv object, as produced by yargs
 * @return {Context} The modified context
 */
OptionStream.prototype.transformContext = function (context, argv) {
    _.forEach(this.options, function (option) {
        context = option.transformContext(context, argv);
    });
    return context;
};

/**
 * Creates a new OptionStream, exposing the provided array of CLI options
 * @param {Option[]} options
 * @returns {OptionStream}
 */
Option.createStream = function (options) {
    return new OptionStream(options);
};

module.exports = Option;