'use strict';

const Action = require('./../Action');

const {isEmpty, filter, uniq, flatten, map, extend, reduce, fromPairs} = require('lodash');

const {mapSeries}   = require('bluebird');
const globby        = require('globby');
const GracefulError = require('shipment').GracefulError;

const RunInstall = require('./RunInstall');
const RunBuild   = require('./RunBuild');
const WriteInfo  = require('./WriteInfo');
const Purge      = require('./Purge');
const WriteSum   = require('./WriteSum');

const skipWriteSum = require('../cli/options/skipWriteSum');

const defaultActions = [
    RunInstall,
    RunBuild,
    WriteInfo,
    Purge,
    WriteSum,
];

class Package extends Action {

    async beforeRun(context, options) {
        super.beforeRun(context, options);
        if (!options.force) {
            const metaFiles = await globby('.build-info*.json');
            if (!isEmpty(metaFiles)) throw new GracefulError('A file named .build-info.json exists in this folder,' +
                ' build is most likely already packaged. Run with -f to continue anyways.');
        }
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
        const subActionOptions = uniq(flatten(map(defaultActions, Action => (new Action()).getAvailableOptions(cli))));
        return [
            skipWriteSum,
            ...subActionOptions,
        ];
    }

    parseArgs(argv, context) {
        return extend(reduce(defaultActions, (options, Action) => {
            return extend({}, options, (new Action()).parseArgs(argv, context));
        }, super.parseArgs(argv, context)), {
            force: argv.f
        });
    }

    /**
     * For the given context, get the array
     * of the action classes that should be executed for the packaging operation
     * @param {Context} context
     * @returns {[]}
     */
    static getActions(context) {
        return filter([
            RunInstall,
            RunBuild,
            WriteInfo,
            Purge,
            context.options['skip-write-sum'] ? null : WriteSum,
        ], a => a !== null);
    }

    async run(context, args) {
        const actions = Package.getActions(context);
        const results = await mapSeries(actions, async Action => {
            let action       = new Action();
            const name       = action.getName();
            const subContext = action.makeContext(args, context.options.cli, context);
            const result     = await action.execute(subContext, args);
            return [name, result];
        });
        return !context.options.cli ? fromPairs(results) : null; // TODO move this logic to reducer(s)
    }
}

Package.description = 'Package the build at the current working directory. ' +
    '(Invokes run-install, run-build, write-info, purge, and write-sum)';

module.exports = Package;