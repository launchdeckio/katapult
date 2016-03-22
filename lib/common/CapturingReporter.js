'use strict';

var Reporter        = require('./Reporter');
var util            = require('util');
var Context         = require('./Context');
var CapturingStream = require('./CapturingStream');

/**
 * An inheritor of the Reporter class that collects all stdout and stderr into a buffer
 * @param {Context} context
 * @constructor
 */
var CapturingReporter = function (context) {
    Reporter.call(this, context);
    this.stdout = new CapturingStream(context.isVerbose() ? process.stdout : null);
    this.stderr = new CapturingStream(context.isVerbose() ? process.stderr : null);
    if (!context.isVerbose())
        this.onCommandExecuted = function () {
        };
};

util.inherits(CapturingReporter, Reporter);

CapturingReporter.prototype.getStdoutStream = function () {
    return this.stdout;
};

CapturingReporter.prototype.getStderrStream = function () {
    return this.stderr;
};

/**
 * Creates a new sub context with a CapturingReporter, based on the provided parent context.
 * @param {Context} parentContext
 */
CapturingReporter.createSubcontext = function (parentContext) {
    var reporter                 = new CapturingReporter(parentContext);
    var subContext               = new Context(parentContext, reporter);
    subContext.options.verbosity = 1;
    return subContext;
};

module.exports = CapturingReporter;