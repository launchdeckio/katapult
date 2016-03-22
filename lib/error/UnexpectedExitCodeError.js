'use strict';

const ControlledError = require('./ControlledError');

class UnexpectedExitCodeError extends ControlledError {

    constructor(exitCode) {
        super();
        this.exitCode = exitCode;
    }
}

module.exports = UnexpectedExitCodeError;