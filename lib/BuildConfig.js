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
        options = _.defaults({}, options, {
            'shared':  [],
            'install': [],
            'build':   [],
            'purge':   []
        });
        ['shared', 'install', 'build', 'purge'].forEach(key => {
            if (!_.isArray(options[key])) options[key] = [];
        });
        this.shared  = options.shared;
        this.install = options.install;
        this.build   = options.build;
        this.purge   = options.purge;
    }

    /**
     * Gets an array of install directives
     * @returns {Array.<Directive>}
     */
    getInstallDirectives(context) {
        return _.map(this.install, object => parseDirective(object));
    }

    /**`
     * Gets an array of build directives
     * @returns {Array.<Directive>}
     */
    getBuildDirectives(context) {
        return _.map(this.build, object => parseDirective(object));
    }
}

module.exports = BuildConfig;