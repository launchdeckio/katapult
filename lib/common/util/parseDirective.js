'use strict';

const {isString, has, omit, forEach, isEmpty} = require('lodash');

const Directive          = require('./../commands/Directive');
const CacheableDirective = require('./../commands/CacheableDirective');
const parseTtl           = require('./parseTtl');

/**
 * Sanitize user-specified cache options.
 * This function mutates the object.
 * @param {Object} cacheOptions
 * @returns {Object}
 */
const sanitizeCacheOptions = cacheOptions => {
    forEach(['input', 'output'], t => {
        if (isString(cacheOptions[t]) && !isEmpty(cacheOptions[t])) cacheOptions[t] = [cacheOptions[t]];
    });
    cacheOptions.ttl = parseTtl(cacheOptions.ttl);
    return cacheOptions;
};

/**
 * Parse the given object into a Directive instance
 * (from the katapult config file, or a predefined config)
 * @param {string|Object} object
 * @returns {Directive|CacheableDirective}
 */
module.exports = object => {

    if (isString(object)) {
        // Using the shorthand string notation,
        // the user may define the most simple type of
        // directive that just contains a shell command
        return new Directive({command: object});
    }

    else if (has(object, 'cmd')) {
        // If the input argument is an object,
        // we need at least the "cmd" property as this
        // will specify the shell command.

        const directiveParameters = {
            command: object.cmd,
            subPath: object.path,
            env:     object.env,
        };

        if (has(object, 'output')) {
            const cacheOptions = omit(object, ['cmd', 'path']);
            sanitizeCacheOptions(cacheOptions);
            return new CacheableDirective(directiveParameters, cacheOptions);
        }

        else return new Directive(directiveParameters);
    }

    else throw new TypeError('Invalid directive: ' + JSON.stringify(object));
};