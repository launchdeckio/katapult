'use strict';

var Option = require('./../Option');

/*
 * With the --preview flag enabled, no actual commands are ran (just listed)
 */

module.exports = Option.createSimpleFlag('preview', 'Preview mode (does not run any actual commands)', 'p');