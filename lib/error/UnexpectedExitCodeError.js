'use strict';

const GracefulError = require('shipment').GracefulError;

class UnexpectedExitCodeError extends GracefulError {

    constructor(exitCode) {
        super();
        this.exitCode = exitCode;
    }
}

module.exports = UnexpectedExitCodeError;