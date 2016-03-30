'use strict';

const _                  = require('lodash');
const Directive          = require('./../commands/Directive');
const CacheableDirective = require('./../commands/CacheableDirective');
const parseTtl           = require('./parseTtl');

/**
 * Parse the given object (from the katapult config file into a Directive instance)
 * @param object
 * @returns {Directive|CacheableDirective}
 */
module.exports = object => {

    if (_.isString(object))
        return new Directive(object);
    else if (_.has(object, 'cmd')) {
        if (_.has(object, 'output')) {
            _.forEach(['input', 'output'], t => {
                if (_.isString(object[t]) && !_.isEmpty(object[t])) object[t] = [object[t]];
            });
            object.ttl = parseTtl(object.ttl);
            return new CacheableDirective(object.cmd, object);
        } else return new Directive(object.cmd);
    }
    else
        throw new TypeError('Invalid directive: ' + JSON.stringify(object));
};