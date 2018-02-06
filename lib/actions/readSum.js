'use strict';

const pify   = require('pify');
const dirsum = pify(require('dirsum').digest);

const withWorkspace = require('../withWorkspace');

module.exports = withWorkspace(context => dirsum(context.env.workspace.buildpath));