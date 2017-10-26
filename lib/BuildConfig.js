'use strict';

const _    = require('lodash');
const yaml = require('js-yaml');

const parseDirective = require('./common/util/parseDirective');

/**
 * Contains the build configuration of a folder
 */
class BuildConfig {

    constructor(options) {
        options = _.defaults({}, options, {
            'shared':  [],
            'install': [],
            'build':   [],
            'purge':   [],
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
    getInstallDirectives() {
        return _.map(this.install, object => parseDirective(object));
    }

    /**
     * Gets an array of build directives
     * @returns {Array.<Directive>}
     */
    getBuildDirectives() {
        return _.map(this.build, object => parseDirective(object));
    }

    /**
     * Given the YAML data as a string, create a new BuildConfig instance
     * @param {String} data
     * @returns {BuildConfig}
     */
    static fromYaml(data) {
        return new BuildConfig(yaml.safeLoad(data));
    }
}

module.exports = BuildConfig;