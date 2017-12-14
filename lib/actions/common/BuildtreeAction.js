'use strict';

const ScannedBuildTree       = require('../../ScannedBuildTree');
const PreconfiguredBuildTree = require('../../PreconfiguredBuildTree');
const BuildpathAction        = require('./BuildpathAction');

/**
 * Base class for actions that depend on the presence of a buildtree object in the options
 */
class BuildtreeAction extends BuildpathAction {

    parseArgs(args, context) {

        const usePreconfigured = args.automation || args.usePreconfigured;

        const buildTree = usePreconfigured ?
            PreconfiguredBuildTree.create(context.buildpath, args.automation) :
            new ScannedBuildTree(context.buildpath);

        return {buildTree};
    }
}

module.exports = BuildtreeAction;