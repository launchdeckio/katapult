'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class Purge extends Action {

    parseArgv(argv) {
        return {buildTree: new BuildTree(process.cwd())};
    }

    run(context, options) {
        return options.buildTree.clean(context);
    }
}
Purge.description = "Wipes files not needed in the build based on the the \"purge\" globs.";

module.exports = Purge;