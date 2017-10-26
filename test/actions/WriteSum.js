'use strict';

require('../support');

const WriteSum         = require('./../../lib/actions/WriteSum');
const useMockWorkspace = require('./../support/useMockWorkspace');
const constants        = require('./../../constants.json');

const path = require('path');
const fs   = require('q-io/fs');

describe('write-sum', () => {

    let mockWorkspace = useMockWorkspace();

    before(mockWorkspace.before);

    after(mockWorkspace.after);

    beforeEach(() => mockWorkspace.get().copy());

    it(`should write some data to ${constants.sumFile}`, async () => {

        process.chdir(mockWorkspace.get().getTmp());

        await (new WriteSum()).executeCli({'predictable-metafiles': true});

        return fs.read(path.join(mockWorkspace.get().getTmp(), constants.sumFile)).should.eventually.not.be.empty;

    }).timeout(10000);
});