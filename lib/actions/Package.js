'use strict';

const Action = require('./../Action');

const _       = require('lodash');
const Promise = require('bluebird');

const RunInstall = require('./RunInstall');
const RunBuild   = require('./RunBuild');
const WriteInfo  = require('./WriteInfo');
const Purge      = require('./Purge');
const WriteSum   = require('./WriteSum');

const actions = [RunInstall, RunBuild, WriteInfo, Purge, WriteSum];

class Package extends Action {

    getAvailableOptions() {
        return _.uniq(_.flatten(_.map(actions, Action => (new Action()).getAvailableOptions())))
    }

    parseArgv(argv) {
        return _.reduce(actions, (options, Action) => {
            return _.extend({}, options, (new Action()).parseArgv(argv));
        }, super.parseArgv(argv));
    }

    run(context, options) {
        return Promise.mapSeries(actions, Action => (new Action()).run(context, options));
    }
}
Package.description = 'Package the build at the current working directory. (Invokes run-install, run-build, write-info, purge, and write-sum)';

module.exports = Package;