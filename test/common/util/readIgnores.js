'use strict';

const path = require('path');

require('../../support');

const readIgnores = require('../../../lib/common/util/readIgnores');

describe('readIgnores', () => {

    it('should read ignores from an ignores file and parse the globs correctly', () => {

        const file = path.join(__dirname, '../../fixtures/ignoreFile');

        const ignores = readIgnores(file);

        ignores.should.be.eql([
            path.join(__dirname, '../../fixtures/danger')
        ]);
    });
});