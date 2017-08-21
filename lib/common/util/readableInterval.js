'use strict';

const numeral = require('numeral');

/**
 * Convert the given amount of milliseconds into a human readable string
 * @param {Number} milliseconds
 * @returns {String}
 */
module.exports = milliseconds => {
    if (milliseconds < 2000) return `${milliseconds} ms`;
    else if (milliseconds < 60000) return `${numeral(milliseconds / 1000).format('0,0.[0]')} s`;
    else return numeral(milliseconds / 1000).format('00:00:00');
};