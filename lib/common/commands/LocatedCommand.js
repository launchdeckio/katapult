'use strict';

class LocatedCommand {

    /**
     * Generic interface that represents a stateless, but located command
     * @param {Directive} directive The directive to run
     * @param {string} [workingDirectory=null] The directory to run the command in
     * @param {string} [relativeDirectory] The working directory relative to the build root
     * @param {boolean} [critical=true] Whether the command is critical. If true, commands waiting to be executed will be
     *     rejected if this one exits with an error
     * @constructor
     */
    constructor(directive, workingDirectory, relativeDirectory, critical) {
        this.directive         = directive;
        this.workingDirectory  = workingDirectory;
        this.relativeDirectory = relativeDirectory;
        this.critical          = typeof critical === typeof undefined ? true : critical;
    }

    /**
     * Returns the absolute working directory for the command
     * @returns {string}
     */
    getWorkingDirectory() {
        return this.workingDirectory;
    }

    /**
     * Returns the working directory for the command, relative to the build root
     * @returns {string|*}
     */
    getRelativeDirectory() {
        return this.relativeDirectory;
    }

    /**
     * @returns {Directive}
     */
    getDirective() {
        return this.directive;
    }

    /**
     * Returns whether the command is critical (the process should be aborted if it returns other than 0)
     * @returns {boolean}
     */
    isCritical() {
        return !!this.critical;
    }
}

module.exports = LocatedCommand;