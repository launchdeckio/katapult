'use strict';

const Action = require('./../Action');

const _             = require('lodash');
const Promise       = require('bluebird');
const globby        = require('globby');
const path          = require('path');
const pathExists    = require('path-exists');
const GracefulError = require('shipment').GracefulError;

const RunInstall = require('./RunInstall');
const RunBuild   = require('./RunBuild');
const WriteInfo  = require('./WriteInfo');
const Purge      = require('./Purge');
const WriteSum   = require('./WriteSum');

const actions = [RunInstall, RunBuild, WriteInfo, Purge, WriteSum];

class Package extends Action {

    beforeRun(context, options) {
        return options.force ? Promise.resolve() : globby(process.cwd(), '.build-info*.json').then(results => {
            if (results) throw new GracefulError('A file named .build-info.json exists in this folder,' +
                ' build is most likely already packaged. Run with -f to continue anyways.');
        });
    }

    describeCommand(yargs) {
        yargs = super.describeCommand(yargs);
        yargs.option('f', {
            'alias':    'force',
            'describe': 'Force package the build'
        });
        return yargs;
    }

    getAvailableOptions() {
        return _.uniq(_.flatten(_.map(actions, Action => (new Action()).getAvailableOptions())));
    }

    parseArgv(argv) {
        return _.extend(_.reduce(actions, (options, Action) => {
            return _.extend({}, options, (new Action()).parseArgv(argv));
        }, super.parseArgv(argv)), {
            force: argv.f
        });
    }

    run(context, options) {
        return Promise.mapSeries(actions, Action => (new Action()).run(context, options));
    }
}
Package.description = 'Package the build at the current working directory. (Invokes run-install, run-build, write-info, purge, and write-sum)';

module.exports = Package;