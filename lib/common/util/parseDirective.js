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
        if (_.has(object, 'input') && _.has(object, 'output')) {
            return new CacheableDirective(object.cmd, object.input, object.output, parseTtl(object.ttl))
        } else return new Directive(object.cmd);
    }
    else
        throw new TypeError('Invalid directive: ' + JSON.stringify(object));
};