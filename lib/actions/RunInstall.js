'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class RunInstall extends Action {

    getAvailableOptions(cli) {
        return super.getAvailableOptions(cli).concat([
            require('./../cli/options/disableCache'),
            require('./../cli/options/workspace')
        ]);
    }

    parseArgs(argv) {
        return {buildTree: new BuildTree(process.cwd())};
    }

    run(context, options) {
        return options.buildTree.install(context);
    }
}
RunInstall.description = "Recursively runs the \"install\" directives starting at the current working directory.";

module.exports = RunInstall;