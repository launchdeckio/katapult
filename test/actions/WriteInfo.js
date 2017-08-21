'use strict';

require('./../support/support');

const WriteInfo        = require('./../../lib/actions/WriteInfo');
const useMockWorkspace = require('./../support/useMockWorkspace');
const constants        = require('./../../constants.json');

const path = require('path');
const fs   = require('q-io/fs');

describe('write-info', () => {

    let mockWorkspace = useMockWorkspace();

    before(mockWorkspace.before);

    after(mockWorkspace.after);

    beforeEach(() => mockWorkspace.get().copy());

    it(`should write some data to ${constants.buildInfoFile}`, () => {

        process.chdir(mockWorkspace.get().getTmp());

        return (new WriteInfo()).executeCli({'predictable-metafiles': true}).then(() => {
            return fs.read(path.join(mockWorkspace.get().getTmp(), constants.buildInfoFile)).then(data => {
                let result = JSON.parse(data);
                result.should.have.property('hash');
                result.should.have.property('tag');
            });
        });
    }).timeout(10000);
});