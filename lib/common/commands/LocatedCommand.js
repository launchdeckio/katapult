'use strict';

class LocatedCommand {

    /**
     * Represents a command and its location
     * @param {Directive} directive The directive to run
     * @param {string} [workingDirectory=null] The base directory to run the command in (without the user subpath)
     * @param {string} [relativeDirectory] The working directory relative to the build root
     * @constructor
     */
    constructor({directive, workingDirectory, relativeDirectory}) {
        this.directive         = directive;
        this.workingDirectory  = workingDirectory;
        this.relativeDirectory = relativeDirectory;
    }

    get identifier() {
        return `${this.relativeDirectory} ${this.directive.identifier}`;
    }

    /**
     * Full working directory that we wanna chdir into
     * before running the command
     * @returns {string}
     */
    get cwd() {
        return `${this.workingDirectory}${this.directive.subPath ? `/${this.directive.subPath}` : ''}`;
    }
}

module.exports = LocatedCommand;