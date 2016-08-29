'use strict';

var sinon         = require('sinon');
var Promise       = require('bluebird');
var events        = require('events');
var streamBuffers = require("stream-buffers");

/**
 * Drop-in mock module for child_process
 * @param {String|null} stdout
 * @param {String|null} stderr
 * @param {Number} [exitCode = 0]
 * @param {Number} [executionTime = 0]
 * @returns {{exec: *}}
 */
var mockChildCommand = function (stdout, stderr, exitCode, executionTime) {
    executionTime = executionTime || 0;
    exitCode      = exitCode || 0;
    return {
        exec: sinon.spy(function (directive) {
            var child    = new events.EventEmitter();
            child.stdout = new streamBuffers.ReadableStreamBuffer();
            child.stdout.put(stdout);
            child.stderr = new streamBuffers.ReadableStreamBuffer();
            child.stderr.put(stderr);
            Promise.delay(executionTime).then(function () {
                child.emit('close', exitCode);
            });
            return child;
        })
    };
};