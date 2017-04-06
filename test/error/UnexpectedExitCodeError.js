'use strict';

require('./../support/support');

const ProcessFailedError = require('./../../lib/error/ProcessFailedError');
const GracefulError      = require('shipment').GracefulError;

describe('ProcessFailedError', () => {

    it('should be a subclass of GracefulError', () => {

        (new ProcessFailedError()).should.be.an.instanceof(GracefulError);
    });

    it('should carry the exitcode', () => {

        const error = new ProcessFailedError({code: 1});
        error.code.should.be.a('number').and.be.equal(1);
    });
});