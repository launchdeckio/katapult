'use strict';

var Promise  = require('bluebird');
var inquirer = require('inquirer');
var _        = require('lodash');

/**
 * Returns a promise for the CLI inquiry
 * @param {Object|String} options
 * @returns {Promise.<*>}
 */
module.exports = function (options) {
    if (typeof options === 'string')
        options = {
            message: options
        };
    return new Promise(function (resolve) {
        inquirer.prompt([_.extend({
            name: 'out'
        }, options)], function (answers) {
            var chosenOne = false;
            if (options.type === 'list' && _.isObject(options.choices[0]) && options.choices[0].hasOwnProperty('name'))
                chosenOne = _.find(options.choices, function (option) {
                    return option.name === answers.out;
                });
            resolve(chosenOne ? chosenOne.val : answers.out);
        });
    });
};