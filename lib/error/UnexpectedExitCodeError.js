'use strict';

const GracefulError = require('shipment').GracefulError;

class UnexpectedExitCodeError extends GracefulError {

    constructor({command, exitCode} = {}) {
        super(`The command ${command ? `"${command}" ` : ''}exited with ${exitCode ? `code ${exitCode}` : 'non-zero'}`);
        this.command  = command;
        this.exitCode = exitCode;
    }
}

module.exports = UnexpectedExitCodeError;