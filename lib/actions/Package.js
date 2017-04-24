'use strict';

const Action = require('./../Action');

const {isEmpty, uniq, flatten, map, extend, reduce, fromPairs} = require('lodash');

const {mapSeries}   = require('bluebird');
const globby        = require('globby');
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
            if (!isEmpty(results)) throw new GracefulError('A file named .build-info.json exists in this folder,' +
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

    getAvailableOptions(cli) {
        return uniq(flatten(map(actions, Action => (new Action()).getAvailableOptions(cli))));
    }

    parseArgs(argv) {
        return extend(reduce(actions, (options, Action) => {
            return extend({}, options, (new Action()).parseArgs(argv));
        }, super.parseArgs(argv)), {
            force: argv.f
        });
    }

    run(context, args) {
        return mapSeries(actions, Action => {
            let action = new Action();
            return Promise.all([
                Promise.resolve(action.getName()),
                action.execute(action.makeContext(args, context.options.cli, context.id), args),
            ]);
        }).then(results => !context.options.cli ? fromPairs(results) : null); // TODO delegate this logic to reducers
    }
}
Package.description = 'Package the build at the current working directory. ' +
    '(Invokes run-install, run-build, write-info, purge, and write-sum)';

module.exports = Package;