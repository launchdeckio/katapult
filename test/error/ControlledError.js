'use strict';

require('./../support/support');

const ControlledError = require('./../../lib/error/ControlledError');

describe('ControlledError', () => {

    it('should be a subclass of error', () => {

        (new ControlledError()).should.be.an.instanceof(Error);
    });
});