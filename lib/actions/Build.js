'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class Build extends Action {

    getDescription() {
        return "Recursively runs the \"build\" directives starting at the current working directory.";
    }

    getAvailableOptions() {
        return super.getAvailableOptions().concat([
            require('./../cli/options/disableCache'),
            require('./../cli/options/workspace'),
            require('./../cli/options/preview')
        ]);
    }

    parseArgv(argv) {
        return {buildTree: new BuildTree(process.cwd())};
    }

    run(context, options) {
        return options.buildTree.build(context);
    }
}

module.exports = Build;