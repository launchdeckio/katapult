#!/usr/bin/env node
'use strict';

const createCommand = require('./../lib/cli/createCommand');
const defaultArgv   = require('./../lib/cli/defaultArgv');
const BuildTree     = require('./../lib/BuildTree');

const optionStream = require('./../lib/cli/options/Option').createStream([
    require('./../lib/cli/options/flags/verbose'),
    require('./../lib/cli/options/flags/disableCache')
]);

const katapultInstall = createCommand((argv, context) => {
    let buildTree = new BuildTree(process.cwd());
    return buildTree.install(context);
}, {
    action:       'Install in place',
    notify:       true,
    optionStream: optionStream
});

if (require.main === module) {
    katapultInstall(defaultArgv(optionStream, 'Usage: katapult install'));
}

exports.command = {
    description: 'Install in place (Recursively runs the install commands in .katapult files contained within the working directory)'
};