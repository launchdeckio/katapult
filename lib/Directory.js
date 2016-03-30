'use strict';

const fs             = require('q-io/fs');
const constants      = require('./../constants.json');
const globUtils      = require('./common/util/globUtils');
const LocatedCommand = require('./common/commands/LocatedCommand');
const BuildConfig    = require('./BuildConfig');
const yaml           = require('js-yaml');
const run            = require('./exec/run');
const sprintf        = require('sprintf-js').sprintf;
const _              = require('lodash');
const path           = require('path');
const del            = require('del');

class Directory {

    /**
     * Represents a directory
     * @param {string} relativePath The relative path
     * @param {string} absolutePath The absolute path
     * @param {BuildConfig} buildConfig
     */
    constructor(relativePath, absolutePath, buildConfig) {
        this.relativePath = relativePath;
        this.absolutePath = absolutePath;
        this.buildConfig  = buildConfig;
    }

    /**
     * @param {Context} context
     * @param {Array.<Directive>} directives
     * @param {string} type
     * @returns {Promise}
     */
    run(context, directives, type) {
        context.reporter.onRunCommands(this, type);
        return run(_.map(directives, function (directive) {
            return new LocatedCommand(directive, this.absolutePath, this.relativePath);
        }.bind(this)), context);
    }

    /**
     * Runs the install commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    install(context) {
        return this.run(context, this.buildConfig.getInstallDirectives(context), 'install');
    }

    /**
     * Runs the build commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    build(context) {
        return this.run(context, this.buildConfig.getBuildDirectives(context), 'build');
    }

    /**
     * Cleans the directory using the globs specified in the config file associated with this directory
     * @param {Context} context
     * @returns {Promise}
     */
    clean(context) {
        var globs = globUtils.resolveGlobArray(this.buildConfig.getPurgeGlobs());
        if (globs.length) {
            context.reporter.onClean(this);
            process.chdir(this.absolutePath);
            return del(globs);
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Returns a promise for the creation of a Directory instance
     * @param {string} rootPath The relative absolutePath
     * @param {string} absolutePath The absolute absolutePath
     * @param {boolean} [loose = false] If true, will generate an "empty" config if the directory does not have
     *                                  a config file
     * @returns {Promise.<Directory>}
     *
     * @throws Error When the config file does not exists and loose is set to false
     */
    static create(rootPath, absolutePath, loose) {
        var relativePath = path.relative(rootPath, absolutePath);
        var configFile   = path.join(absolutePath, constants.configFile);
        return fs.exists(configFile).then(exists => {
            if (!exists && loose) {
                console.warn('No "%s" found in directory "%s", using default', constants.configFile, absolutePath);
                return new Directory(relativePath, absolutePath, new BuildConfig());
            } else if (!exists)
                throw new Error(sprintf('No "%s" found in directory "%s"', constants.configFile, absolutePath));
            else return fs.read(configFile).then(function (configFileData) {
                    var config = new BuildConfig(yaml.safeLoad(configFileData));
                    return new Directory(relativePath, absolutePath, config);
                });
        });
    }

    /**
     * Return a promise for the creation of a Directory instance
     * @param {string} root
     * @param {string} configFile
     * @returns {Promise.<Directory>}
     */
    static fromConfig(root, configFile) {
        return Directory.create(root, path.dirname(configFile));
    }
}

module.exports = Directory;