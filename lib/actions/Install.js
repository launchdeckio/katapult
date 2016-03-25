'use strict';

const Action    = require('./../Action');
const BuildTree = require('./../BuildTree');

class Install extends Action {

    getDescription() {
        return "Recursively runs the \"install\" directives starting at the current working directory.";
    }

    getOptions(argv) {
        return {buildTree: new BuildTree(process.cwd())};
    }

    run(context, options) {
        return options.buildTree.install(context);
    }
}

module.exports = Install;