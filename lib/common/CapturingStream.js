'use strict';

var streamBuffers = require("stream-buffers");
var stream        = require('stream');
var util          = require('util');

var CapturingStream = function (output) {
    CapturingStream.super_.prototype.constructor.apply(this, arguments);
    this.buffer = new streamBuffers.WritableStreamBuffer();
    this.output = output;
};

util.inherits(CapturingStream, stream.Writable);

CapturingStream.prototype.write = function (data, encoding, callback) {
    this.buffer.write(data);
    if (this.output)
        this.output.write(data);
    if (callback)
        callback(null, data);
};

module.exports = CapturingStream;