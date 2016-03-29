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
        this.critical          = typeof critical === typeof undefined ? true : !!critical;
    }
}

module.exports = LocatedCommand;