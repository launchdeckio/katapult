'use strict';

const numeral = require('numeral');
const sprintf = require('sprintf-js').sprintf;

/**
 * Convert the given amount of milliseconds into a human readable string
 * @param {Number} milliseconds
 * @returns {String}
 */
module.exports = milliseconds => {
    if (milliseconds < 2000) return sprintf('%d ms', milliseconds);
    else if (milliseconds < 60000) return sprintf('%s s', numeral(milliseconds / 1000).format('0,0.[0]'));
    else return numeral(milliseconds / 1000).format('00:00:00');
};