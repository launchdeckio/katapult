'use strict';

require('../support');

const WriteSum         = require('./../../lib/actions/WriteSum');
const useMockWorkspace = require('./../support/useMockWorkspace');
const constants        = require('./../../constants.json');

const path     = require('path');
const bluebird = require('bluebird');

const fs = bluebird.promisifyAll(require('fs'));

describe('write-sum', () => {

    let mockWorkspace = useMockWorkspace();

    before(mockWorkspace.before);
    after(mockWorkspace.after);
    beforeEach(mockWorkspace.copy);

    it(`should write some data to ${constants.sumFile}`, async () => {

        process.chdir(mockWorkspace.tmp);

        await (new WriteSum()).executeCli({'predictable-metafiles': true});

        const data = await fs.readFileAsync(path.join(mockWorkspace.tmp, constants.sumFile));

        data.should.not.be.empty;

    }).timeout(10000);
});