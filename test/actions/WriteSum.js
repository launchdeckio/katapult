'use strict';

require('./../support/support');

const WriteSum      = require('./../../lib/actions/WriteSum');
const MockWorkspace = require('./../support/MockWorkspace');
const constants     = require('./../../constants.json');

const sprintf = require('sprintf-js').sprintf;
const path    = require('path');
const fs      = require('q-io/fs');

describe('write-sum', () => {

    let mockWorkspace;

    before(() => {

        mockWorkspace = new MockWorkspace(__dirname);
        return mockWorkspace.setup();
    });

    after(() => {

        return mockWorkspace.tearDown();
    });

    beforeEach(() => mockWorkspace.copy());

    it(sprintf('should write some data to %s', constants.sumFile), () => {

        process.chdir(mockWorkspace.getTmp());

        return (new WriteSum()).executeCommand({}).then(() => {
            return fs.read(path.join(mockWorkspace.getTmp(), constants.sumFile)).should.eventually.not.be.empty;
        });
    });
});