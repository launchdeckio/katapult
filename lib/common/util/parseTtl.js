'use strict';

const _             = require('lodash');
const humanInterval = require('human-interval');

const units = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year'
];

module.exports = ttl => {

    if (!ttl) return null;

    if (_.isNumber(ttl)) return ttl;

    if (/^\d+$/.test(ttl)) return parseInt(ttl);

    ttl = ttl.toLowerCase();

    _.forEach(units, unit => {

        let match;
        const patt   = `([\\d\\s])(${unit.substring(0, 1)})(?:$|\\d)`;
        const regexp = new RegExp(patt, 'g');
        while ((match = regexp.exec(ttl)) !== null) {
            let index = match.index + match[1].length;
            ttl       = ttl.substring(0, index) + unit + ttl.substring(index + match[2].length);
        }
    });

    try {
        ttl = humanInterval(ttl);
    } catch (e) {
        return null;
    }

    if (_.isNaN(ttl))
        return null;

    return ttl;
};