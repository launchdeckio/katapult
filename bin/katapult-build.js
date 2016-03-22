#!/usr/bin/env node
'use strict';

const createCommand = require('./../lib/cli/createCommand');
const defaultArgv   = require('./../lib/cli/defaultArgv');
const BuildTree     = require('./../lib/BuildTree');

const optionStream = require('./../lib/cli/options/Option').createStream([
    require('./../lib/cli/options/flags/verbose'),
    require('./../lib/cli/options/flags/disableCache')
]);

var katapultBuild = createCommand((argv, context) => {
    var buildTree = new BuildTree(process.cwd());
    return buildTree.build(context);
}, {
    action:       'Build in place',
    notify:       true,
    optionStream: optionStream
});

if (require.main === module) {
    katapultBuild(defaultArgv(optionStream, 'Usage: katapult build'));
}

exports.command = {
    description: 'Build in place (Recursively runs the build commands in .katapult files contained within the working directory)'
};