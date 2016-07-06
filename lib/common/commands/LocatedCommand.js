'use strict';

class LocatedCommand {

    /**
     * Represents a command and its location
     * @param {Directive} directive The directive to Runner
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