'use strict';

require('./../support/support');

const UnexpectedExitCodeError = require('./../../lib/error/UnexpectedExitCodeError');
const ControlledError         = require('./../../lib/error/ControlledError');

describe('UnexpectedExitCodeError', () => {

    it('should be a subclass of ControlledError', () => {

        (new UnexpectedExitCodeError()).should.be.an.instanceof(ControlledError);
    });

    it('should carry the exitcode', () => {

        const error = new UnexpectedExitCodeError(1);
        error.exitCode.should.be.a('number').and.be.equal(1);
    });
});