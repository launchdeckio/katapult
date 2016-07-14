'use strict';

require('./../support/support');

const WriteInfo     = require('./../../lib/actions/WriteInfo');
const MockWorkspace = require('./../support/MockWorkspace');
const constants     = require('./../../constants.json');

const sprintf = require('sprintf-js').sprintf;
const path    = require('path');
const fs      = require('q-io/fs');

describe('write-info', () => {

    let mockWorkspace;

    before(() => {

        mockWorkspace = new MockWorkspace(__dirname);
        return mockWorkspace.setup();
    });

    after(() => {

        return mockWorkspace.tearDown();
    });

    beforeEach(() => mockWorkspace.copy());

    it(sprintf('should write some data to %s', constants.buildInfoFile), () => {

        process.chdir(mockWorkspace.getTmp());

        return (new WriteInfo()).executeCommand({}).then(() => {
            return fs.read(path.join(mockWorkspace.getTmp(), constants.buildInfoFile)).then(data => {
                let result = JSON.parse(data);
                result.should.have.property('hash');
                result.should.have.property('tag');
            });
        });
    }).timeout(5000);
});