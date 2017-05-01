'use strict';

const Action                 = require('../../Action');
const ScannedBuildTree       = require('../../ScannedBuildTree');
const PreconfiguredBuildTree = require('../../PreconfiguredBuildTree');

/**
 * Base class for actions that depend on the presence of a buildtree object in the options
 */
class BuildtreeAction extends Action {

    parseArgs(args) {
        const buildTree = args.install || args.build || args.purge ?
            PreconfiguredBuildTree.create(process.cwd(), args) :
            new ScannedBuildTree(process.cwd());
        return {buildTree};
    }
}

module.exports = BuildtreeAction;