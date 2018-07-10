'use strict';

const fs    = require('fs');
const path  = require('path');
const Cache = require('johnnycache');

const monitorCache           = require('../support/monitorCacheLifecycle');
const LocalAgent             = require('../io/LocalAgent');
const PreconfiguredBuildTree = require('../PreconfiguredBuildTree');
const ScannedBuildTree       = require('../ScannedBuildTree');

const constants = require('../../constants');

class Workspace {

    constructor({

        buildPath = process.cwd(),
        workspace = null,
        agent = new LocalAgent(),
        disableCache = false,
        maxCacheSize = '512mb',

        automation,
        usePreconfigured,

    } = {}, emit = null) {

        this.workspacePath = path.join(
            workspace !== null ? fs.realpathSync(workspace) : process.cwd(),
            constants.workspace);

        this.buildPath = buildPath;
        this.agent     = agent;

        this.buildTree = automation || usePreconfigured ?
            PreconfiguredBuildTree.create(buildPath, automation) :
            new ScannedBuildTree(buildPath);

        if (!disableCache) this.prepareCache(maxCacheSize, emit);
    }

    get cacheFolder() {
        return path.join(this.workspacePath, constants.cacheFolder);
    }

    prepareCache(maxCacheSize, emit = null) {

        this.cache = new Cache({
            maxSize:   maxCacheSize,
            workspace: this.cacheFolder,
            lazyLoad:  true
        });

        if (emit) monitorCache(emit, this.cache);
    }
}

module.exports = Workspace;