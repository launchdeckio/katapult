'use strict';

const fs    = require('fs');
const path  = require('path');
const Cache = require('johnnycache');

const monitorCache           = require('./../report/monitorCacheLifecycle');
const LocalAgent             = require('../io/LocalAgent');
const PreconfiguredBuildTree = require('../PreconfiguredBuildTree');
const ScannedBuildTree       = require('../ScannedBuildTree');

const constants = require('../../constants');

class Workspace {

    constructor({

        buildpath = process.cwd(),
        workspace = null,
        agent = new LocalAgent(),
        disableCache = false,
        maxCacheSize = '512mb',

        automation,
        usePreconfigured,

    } = {}, emit = null) {

        this.workspacePath = workspace !== null ?
            fs.realpathSync(workspace) :
            path.join(process.cwd(), constants.workspace);

        this.buildpath = buildpath;
        this.agent     = agent;

        this.buildTree = automation || usePreconfigured ?
            PreconfiguredBuildTree.create(buildpath, automation) :
            new ScannedBuildTree(buildpath);

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