'use strict';

require('./../../support/support');

const parseTtl = require('./../../../lib/common/util/parseTtl');
const expect   = require('chai').expect;

describe('parseTtl', () => {

    it('should parse various formats of ttl', () => {

        parseTtl(100).should.equal(100);
        parseTtl('100').should.equal(100);
        parseTtl('100seconds').should.equal(100000);
        parseTtl('100second').should.equal(100000);
        parseTtl('100 seconds').should.equal(100000);
        parseTtl('100 second').should.equal(100000);
        parseTtl('100s').should.equal(100000);
        parseTtl('100 s').should.equal(100000);

        parseTtl('1h').should.equal(60 * 60 * 1000);
        parseTtl('1 hour').should.equal(60 * 60 * 1000);

        parseTtl('1d').should.equal(24 * 60 * 60 * 1000);
        parseTtl('1 day').should.equal(24 * 60 * 60 * 1000);

        expect(parseTtl('foobar')).to.be.null;
        expect(parseTtl()).to.be.null;
    });
});