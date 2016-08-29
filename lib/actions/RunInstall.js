'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class RunInstall extends Action {

    getAvailableOptions() {
        return super.getAvailableOptions().concat([
            require('./../cli/options/workspace'),
            require('./../cli/options/preview')
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