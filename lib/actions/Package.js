'use strict';

const Action = require('./../Action');

const _             = require('lodash');
const Promise       = require('bluebird');
const globby        = require('globby');
const path          = require('path');
const GracefulError = require('shipment').GracefulError;

const RunInstall = require('./RunInstall');
const RunBuild   = require('./RunBuild');
const WriteInfo  = require('./WriteInfo');
const Purge      = require('./Purge');
const WriteSum   = require('./WriteSum');

const actions = [RunInstall, RunBuild, WriteInfo, Purge, WriteSum];

class Package extends Action {

    beforeRun(context, options) {
        super.beforeRun(context, options);
        return options.force ? Promise.resolve() : globby('.build-info*.json').then(results => {
            if (!_.isEmpty(results)) throw new GracefulError('A file named .build-info.json exists in this folder,' +
                ' build is most likely already packaged. Run with -f to continue anyways.');
        });
    }

    describeAction(yargs) {
        yargs = super.describeAction(yargs);
        yargs.option('f', {
            'alias':    'force',
            'describe': 'Force package the build'
        });
        return yargs;
    }

    getAvailableOptions() {
        return _.uniq(_.flatten(_.map(actions, Action => (new Action()).getAvailableOptions())));
    }

    parseArgs(argv) {
        return _.extend(_.reduce(actions, (options, Action) => {
            return _.extend({}, options, (new Action()).parseArgs(argv));
        }, super.parseArgs(argv)), {
            force: argv.f
        });
    }

    run(context, options) {
        return Promise.mapSeries(actions, Action => (new Action()).executeApi(options, context.id));
    }
}
Package.description = 'Package the build at the current working directory. ' +
    '(Invokes run-install, run-build, write-info, purge, and write-sum)';

module.exports = Package;