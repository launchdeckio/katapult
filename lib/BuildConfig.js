'use strict';

const _                  = require('lodash');
const Directive          = require('./common/commands/Directive');
const CacheableDirective = require('./common/commands/CacheableDirective');
const parseDirective     = require('./common/util/parseDirective');

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
     * Gets an array of install directives
     * @returns {Array.<Directive>}
     */
    getInstallDirectives(context) {
        return _.map(this.options.install, object => parseDirective(object));
    }

    /**`
     * Gets an array of build directives
     * @returns {Array.<Directive>}
     */
    getBuildDirectives(context) {
        return _.map(this.options.build, object => parseDirective(object));
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