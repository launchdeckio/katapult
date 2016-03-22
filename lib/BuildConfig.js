'use strict';

const _                  = require('lodash');
const Directive          = require('./common/commands/Directive');
const CacheableDirective = require('./common/commands/CacheableDirective');

/**
 * Contains the build configuration of a folder
 */
class BuildConfig {

    constructor(options) {
        this.options = _.defaults({}, options, {
            'shared':  [],
            'install': [],
            'build':   [],
            'purge':   []
        });
        ['shared', 'install', 'build', 'purge'].forEach(arrayItem => {
            if (this.options[arrayItem] === null)
                this.options[arrayItem] = [];
        });
    }

    /**
     * Gets an array of shared folders and directories
     * @returns {Array.<string>}
     */
    getSharedEntries() {
        return this.options.shared;
    }

    /**
     * TODO should be static method of Directive
     * @param {string|object} object
     * @param {Context} context
     * @returns {Directive}
     */
    createDirective(object, context) {
        if (_.isString(object))
            return new Directive(object);
        else if (_.has(object, 'cmd'))
            return _.has(object, 'input') && _.has(object, 'output') && context.enableCaching() ?
                new CacheableDirective(object.cmd, object.input, object.output) :
                new Directive(object.cmd);
        else
            throw new TypeError('Invalid directive: ' + JSON.stringify(object));
    }

    /**
     * Gets an array of install directives
     * @returns {Array.<Directive>}
     */
    getInstallDirectives(context) {
        return _.map(this.options.install, directive => this.createDirective(directive, context));
    }

    /**
     * Gets an array of build directives
     * @returns {Array.<Directive>}
     */
    getBuildDirectives(context) {
        return _.map(this.options.build, directive => this.createDirective(directive, context));
    }

    /**
     * Gets an array of the globs to clean
     * @returns {Array.<string>}
     */
    getPurgeGlobs() {
        return this.options.purge;
    }
}

module.exports = BuildConfig;