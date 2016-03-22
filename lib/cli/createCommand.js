'use strict';

const _       = require('lodash');
const Context = require('./../common/Context');

module.exports = function (run, options) {

    options = _.defaults({}, options, {
        action: 'Action',
        notify: false
    });

    options = _.defaults(options, {
        completed: options.action + ' completed',
        aborted:   options.action + ' aborted'
    });

    return (argv) => {
        let context = Context.createCliContext();
        if (options.optionStream)
            context = options.optionStream.transformContext(context, argv);
        run(argv, context)
            .then(context.getReporter().onComplete.bind(context.getReporter(), options.completed, options.notify))
            .catch(e => context.getReporter().onError(e, options.notify ? options.aborted : false))
            .done();
    };
};