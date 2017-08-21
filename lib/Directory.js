'use strict';

const _                 = require('lodash');
const fs                = require('q-io/fs');
const sprintf           = require('sprintf-js').sprintf;
const path              = require('path');
const del               = require('del');
const makeGlobsAbsolute = require('make-globs-absolute');
const pathExists        = require('path-exists');

const constants      = require('./../constants.json');
const globUtils      = require('./common/util/globUtils');
const LocatedCommand = require('./common/commands/LocatedCommand');
const BuildConfig    = require('./BuildConfig');
const Runner         = require('./common/Runner');

const events = require('./events');

class Directory {

    /**
     * Represents a directory
     * @param {string} relativePath The path relative to the build root ("" if build root)
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
     * @returns {Promise}
     */
    run(context, directives) {
        return new Runner(context).run(_.map(directives, directive => this.makeLocatedCommand(directive)));
    }

    /**
     * Wrap the given directive in a LocatedCommand
     * @param {Directive} directive
     * @returns {LocatedCommand}
     */
    makeLocatedCommand(directive) {
        return new LocatedCommand(directive, this.absolutePath, this.relativePath);
    }

    /**
     * Runs the install commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    install(context) {
        context.emit[events.RUN_INSTALL](this.relativePath);
        return this.run(context, this.buildConfig.getInstallDirectives());
    }

    /**
     * Runs the build commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    build(context) {
        context.emit[events.RUN_BUILD](this.relativePath);
        return this.run(context, this.buildConfig.getBuildDirectives());
    }

    /**
     * Cleans the directory using the globs specified in the config file associated with this directory
     * @param {Context} context
     * @returns {Promise}
     */
    clean(context) {
        let globs = globUtils.resolveGlobArray(this.buildConfig.purge);
        if (globs.length) {
            context.emit[events.CLEAN](this.relativePath);
            process.chdir(this.absolutePath);
            globs = globs.concat(['!.build-{info,sum}*.json']); // Let's not erase the .build-info.json file
            globs = makeGlobsAbsolute(globs, this.absolutePath);
            return del(globs);
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Returns a promise for the creation of a Directory instance
     * @param {string} buildRoot The build root
     * @param {string} absolutePath The path to this directory
     * @returns {Promise.<Directory>}
     * @throws Error When the config file does not exists
     */
    static fromConfig(buildRoot, absolutePath) {
        const relativePath = path.relative(buildRoot, absolutePath);
        const configFile   = path.join(absolutePath, constants.configFile);
        return pathExists(configFile).then(exists => {
            if (!exists)
                throw new Error(`No ${constants.configFile} found in directory ${absolutePath}`);
            else return fs.read(configFile).then(configFileData => {
                const config = BuildConfig.fromYaml(configFileData);
                return new Directory(relativePath, absolutePath, config);
            });
        });
    }
}

module.exports = Directory;