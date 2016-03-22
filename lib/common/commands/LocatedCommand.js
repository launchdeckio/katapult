'use strict';

class LocatedCommand {

    /**
     * Generic interface that represents a stateless, but located command
     * @param {Directive} directive The directive to run
     * @param {string} [workingDirectory=null] The directory to run the command in
     * @param {string} [relativeDirectory] The working directory relative to the build root
     * @param {boolean} [critical=true] Whether the command is critical. If true, commands waiting to be executed will be
     *     rejected if this one exits with an error
     * @param {boolean} [verbose=true] Whether to pipe the output of this command to the main output
     * @constructor
     */
    constructor(directive, workingDirectory, relativeDirectory, critical, verbose) {
        this.directive         = directive;
        this.workingDirectory  = workingDirectory;
        this.relativeDirectory = relativeDirectory;
        this.critical          = typeof critical === typeof undefined ? true : critical;
        this.verbose           = typeof verbose === typeof undefined ? true : verbose;
    }

    getWorkingDirectory() {
        return this.workingDirectory;
    }

    getRelativeDirectory() {
        return this.relativeDirectory;
    }

    /**
     * @returns {Directive}
     */
    getDirective() {
        return this.directive;
    }

    isCritical() {
        return this.critical;
    }

    isVerbose() {
        return this.verbose;
    }
}

module.exports = LocatedCommand;