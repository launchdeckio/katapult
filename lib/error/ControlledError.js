'use strict';

var util = require('util');

function ControlledError(message) {
    Error.call(this);
    this.message = message;
}

util.inherits(ControlledError, Error);

module.exports = ControlledError;