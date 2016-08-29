'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class RunBuild extends Action {

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
        return options.buildTree.build(context);
    }
}
RunBuild.description = "Recursively runs the \"build\" directives starting at the current working directory.";

module.exports = RunBuild;