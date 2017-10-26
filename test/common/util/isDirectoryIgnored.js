'use strict';

require('../../support');

const isDirectoryIgnored = require('./../../../lib/common/util/isDirectoryIgnored');

const fga = require('./../../../lib/common/util/globUtils').flattenGlobArray;

const idi = (directory, ignores, globalIgnores) => isDirectoryIgnored(directory, ignores ? fga(ignores) : undefined, globalIgnores);

describe('isDirectoryIgnored', () => {

    it('should determine whether to ignore the given directory based on the given globs', () => {

        idi('foobar').should.be.false;
        idi('foobar', ['foobar']).should.be.true;
        idi('foobar', ['!foobar']).should.be.false;

        idi('foobar/baz', ['foobar']).should.be.false;
        // This one should be false, because the directory 'foobar' will never have been reached thus foobar/baz will
        // not be tried

        idi('foobar', ['!foobar/baz']).should.be.false;
        idi('foobar/baz', ['!foobar/baz']).should.be.false;
        idi('foobar/baz', ['foobar/baz']).should.be.true;
        idi('foobar/baz', ['foobar', '!foobar/baz']).should.be.false;
    });

    it('should also take into account the globalIgnores, if given', () => {

        idi('.idea').should.be.false;
        idi('.idea', [], ['.idea']).should.be.true;
        idi('folder/.idea', [], ['.idea']).should.be.true;
    });
});