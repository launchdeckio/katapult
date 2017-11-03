'use strict';

const exec     = require('child_process').exec;
const monitor  = require('shipment-monitor-process');
const bluebird = require('bluebird');

const fs = bluebird.promisifyAll(require('fs'));

const ls                 = require('../common/util/ls');
const AgentInterface     = require('./AgentInterface');
const ProcessFailedError = require('./../error/ProcessFailedError');

const Process = monitor.Process;

class LocalAgent extends AgentInterface {

    async dir(root) {
        return await ls(root);
    }

    async read(path) {
        return await fs.readFileAsync(path);
    }

    async write(path, contents) {
        return await fs.writeFileAsync(path, contents);
    }

    async run(context, command) {

        const child = exec(command.directive.command, {
            cwd:       command.cwd,
            maxBuffer: 1024 * 1024,
        });

        const process = new Process(command.directive.command, child);
        process.cwd   = `<package>/${command.relativeDirectory}`;
        if (command.directive.subPath) process.cwd += `/${command.directive.subPath}`;

        try {
            return await monitor(context, process);

        } catch (e) {

            // propagate non-zero-exitcode errors as a proper
            // instance type so that queue can be canceled if one occurs
            if (e.code || e.signal)
                throw new ProcessFailedError({
                    code:    e.code,
                    signal:  e.signal,
                    command: command.directive.command
                });

            else throw e;
        }
    }
}

module.exports = LocalAgent;