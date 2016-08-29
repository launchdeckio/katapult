'use strict';

const _                  = require('lodash');
const Directive          = require('./../commands/Directive');

/**
 * Parse the given object (from the katapult config file into a Directive instance)
 * @param object
 * @returns {Directive}
 */
module.exports = object => {

    if (_.isString(object))
        return new Directive(object);
    else if (_.has(object, 'cmd'))
        return new Directive(object.cmd);
    else
        throw new TypeError('Invalid directive: ' + JSON.stringify(object));
};