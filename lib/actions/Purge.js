'use strict';

const Action           = require('./../Action');
const ScannedBuildTree = require('../ScannedBuildTree');

class Purge extends Action {

    parseArgs() {
        return {buildTree: new ScannedBuildTree(process.cwd())};
    }

    run(context, options) {
        return options.buildTree.clean(context);
    }
}
Purge.description = 'Wipes files not needed in the build based on the the "purge" globs.';

module.exports = Purge;