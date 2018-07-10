'use strict';

const {map}             = require('lodash');
const bluebird          = require('bluebird');
const path              = require('path');
const del               = require('del');
const makeGlobsAbsolute = require('make-globs-absolute');
const pathExists        = require('path-exists');

const constants          = require('./../constants.json');
const assertPathsSafe    = require('./common/util/assertPathsSafe');
const LocatedCommand     = require('./common/commands/LocatedCommand');
const BuildConfig        = require('./BuildConfig');
const Runner             = require('./common/Runner');

const events = require('./events');

const fs = bluebird.promisifyAll(require('fs'));

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
        return new Runner(context).run(map(directives, directive => this.makeLocatedCommand(directive)));
    }

    /**
     * Wrap the given directive in a LocatedCommand
     * @param {Directive} directive
     * @returns {LocatedCommand}
     */
    makeLocatedCommand(directive) {
        return new LocatedCommand({
            directive,
            workingDirectory:  this.absolutePath,
            relativeDirectory: this.relativePath
        });
    }

    /**
     * Runs the install commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    install(context) {
        context.emit(events.runInstall(this.relativePath));
        return this.run(context, this.buildConfig.getInstallDirectives());
    }

    /**
     * Runs the build commands for this directory
     * @param {Context} context
     * @returns {Promise}
     */
    build(context) {
        context.emit(events.runBuild(this.relativePath));
        return this.run(context, this.buildConfig.getBuildDirectives());
    }

    /**
     * Cleans the directory using the globs specified in the
     * config file associated with this directory
     * @param {Context} context
     * @returns {Promise}
     */
    async clean(context) {
        // @TODO deal with "globby" bug (https://github.com/sindresorhus/del#beware)

        let globs = this.buildConfig.purge;

        if (globs.length) {

            context.emit(events.clean(this.relativePath));

            // We're manually implementing a safety check here
            // because the "del" module does not take into consideration
            // the `cwd` option when running the original safety check.
            assertPathsSafe(globs);

            globs = makeGlobsAbsolute(globs, this.absolutePath);

            await del(globs, {
                cwd:   this.absolutePath,
                force: true,
            });
        }
    }

    /**
     * Returns a promise for the creation of a Directory instance
     * @param {string} buildRoot The build root
     * @param {string} absolutePath The path to this directory
     * @returns {Promise.<Directory>}
     * @throws Error When the config file does not exists
     */
    static async fromConfig(buildRoot, absolutePath) {
        // @TODO use agent for reading the files
        const relativePath = path.relative(buildRoot, absolutePath);
        const configFile   = path.join(absolutePath, constants.configFile);
        const exists       = await pathExists(configFile);
        if (!exists)
            throw new Error(`No ${constants.configFile} found in directory ${absolutePath}`);
        else {
            const configFileData = await fs.readFileAsync(configFile);
            const config         = BuildConfig.fromYaml(configFileData);
            return new Directory(relativePath, absolutePath, config);
        }
    }
}

module.exports = Directory;