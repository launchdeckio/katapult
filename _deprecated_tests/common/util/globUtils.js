'use strict';

require('../../support');

var globUtils = require('./../../../lib/common/util/globUtils');

describe('globUtils', function () {

    describe('.resolveGlobArray()', function () {

        it('should append * and .* if the array is a negating glob array', function () {

            globUtils.resolveGlobArray(['foo', 'bar']).should.deep.equal(['foo', 'bar']);
            globUtils.resolveGlobArray(['!foo', '!bar']).should.deep.equal(['*', '.*', '!foo', '!bar']);

        });

    });

});