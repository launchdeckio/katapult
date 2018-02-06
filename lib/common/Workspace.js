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

    } = {}) {

        this.workspacePath = workspace !== null ?
            fs.realpathSync(workspace) :
            path.join(process.cwd(), constants.workspace);

        this.buildpath = buildpath;
        this.agent     = agent;

        this.buildTree = automation || usePreconfigured ?
            PreconfiguredBuildTree.create(buildpath, automation) :
            new ScannedBuildTree(buildpath);

        if (!disableCache) {

            this.cache = new Cache({
                maxSize:   maxCacheSize,
                workspace: this.cacheFolder,
                lazyLoad:  true
            });

            // Monitor cache lifecycle
            if (this.cache && !this.cache.monitoring) {
                monitorCache(this.emit, this.cache);
                this.cache.monitoring = this;
                // TODO find a neater way to monitor the cache in the most relevant context
            }
        }
    }

    get cacheFolder() {
        return path.join(this.workspacePath, constants.cacheFolder);
    }
}

module.exports = Workspace;