'use strict';

class LocatedCommand {

    /**
     * Generic interface that represents a stateless, but located command
     * @param {Directive} directive The directive to run
     * @param {string} [workingDirectory=null] The directory to run the command in
     * @param {string} [relativeDirectory] The working directory relative to the build root
     * @constructor
     */
    constructor(directive, workingDirectory, relativeDirectory) {
        this.directive         = directive;
        this.workingDirectory  = workingDirectory;
        this.relativeDirectory = relativeDirectory;
    }
}

module.exports = LocatedCommand;