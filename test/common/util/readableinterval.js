'use strict';

require('./../../support/support');

const readableInterval = require('./../../../lib/common/util/readableInterval');

describe('readableInterval', () => {
    it('should convert the given amount of milliseconds into a human readable format', () => {
        readableInterval(100).should.equal('100 ms');
        readableInterval(1900).should.equal('1900 ms');
        readableInterval(13337).should.equal('13.3 s');
        readableInterval(50000).should.equal('50 s');
        readableInterval(120000).should.equal('0:02:00');
    });
});