'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class Purge extends Action {

    getDescription() {
        return "Wipes files not needed in the build based on the the \"purge\" globs.";
    }

    getContextDefaults() {
        return {cache: false};
    }

    parseArgv(argv) {
        return {buildTree: new BuildTree(process.cwd())};
    }

    runControlled(context, options) {
        return options.buildTree.clean(context);
    }
}

module.exports = Purge;