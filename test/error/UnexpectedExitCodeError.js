'use strict';

require('./../support/support');

const UnexpectedExitCodeError = require('./../../lib/error/UnexpectedExitCodeError');
const GracefulError           = require('shipment').GracefulError;

describe('UnexpectedExitCodeError', () => {

    it('should be a subclass of GracefulError', () => {

        (new UnexpectedExitCodeError()).should.be.an.instanceof(GracefulError);
    });

    it('should carry the exitcode', () => {

        const error = new UnexpectedExitCodeError({exitCode: 1});
        error.exitCode.should.be.a('number').and.be.equal(1);
    });
});