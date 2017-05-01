'use strict';

const path = require('path');

const Runner = require('./common/Runner');

const events = require('./events');

const LocatedCommand = require('./common/commands/LocatedCommand.js');
const Directive      = require('./common/commands/Directive.js');

const {map, get} = require('lodash');

/**
 * Buildtree that instead of scanning for .katapult.yml runs based on a predefined configuration
 */
class PreconfiguredBuildTree {

    /**
     * @param {LocatedCommand[]} install
     * @param {LocatedCommand[]} build
     * @param {String[]} purge
     */
    constructor({
        install = [],
        build = [],
        purge = [],
    }) {
        this.config = {install, build, purge};
    }

    /**
     * Run all the given LocatedCommands in a new Runner instance
     * @param context
     * @param commands
     * @returns {Promise}
     */
    runAll(context, commands) {
        return new Runner(context).run(commands);
    }

    install(context) {
        context.emit[events.RUN_INSTALL]("");
        return this.runAll(context, this.config.install);
    }

    build(context) {
        context.emit[events.RUN_BUILD]("");
        return this.runAll(context, this.config.build);
    }

    clean(context) {
        // @TODO implement purge based on predefined configuration
    }

    static create(root, config) {
        const getCmds = type => map(get(config, type), cmd => {
            const directive   = new Directive(cmd.command);
            const relativeDir = cmd.workDir;
            const absoluteDir = path.join(root, relativeDir);
            return new LocatedCommand(directive, absoluteDir, relativeDir);
        });
        const install = getCmds('install');
        const build   = getCmds('build');
        const purge   = []; // @TODO
        return new PreconfiguredBuildTree({install, build, purge});
    }
}


module.exports = PreconfiguredBuildTree;