'use strict';

const Action = require('./../Action');

const {filter, uniq, flatten, map, extend, reduce, fromPairs} = require('lodash');

const {mapSeries} = require('bluebird');

const RunInstall = require('./RunInstall');
const RunBuild   = require('./RunBuild');
const Purge      = require('./Purge');
const ReadSum    = require('./ReadSum');

const skipReadSum = require('../cli/options/skipReadSum');

const defaultActions = [
    RunInstall,
    RunBuild,
    Purge,
    ReadSum,
];

class Package extends Action {

    getAvailableOptions(cli) {
        const subActionOptions = uniq(flatten(map(defaultActions, Action => (new Action()).getAvailableOptions(cli))));
        return [
            skipReadSum,
            ...subActionOptions,
        ];
    }

    parseArgs(argv, context) {
        return extend(reduce(defaultActions, (options, Action) => {
            return extend({}, options, (new Action()).parseArgs(argv, context));
        }, super.parseArgs(argv, context)));
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
            Purge,
            context.options['skip-read-sum'] ? null : ReadSum,
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
    '(Invokes run-install, run-build, purge, and read-sum)';

module.exports = Package;