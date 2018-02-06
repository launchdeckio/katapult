'use strict';

const pify   = require('pify');
const dirsum = pify(require('dirsum').digest);

module.exports = context => dirsum(context.args.buildpath);