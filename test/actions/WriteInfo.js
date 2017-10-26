'use strict';

require('../support');

const WriteInfo        = require('./../../lib/actions/WriteInfo');
const useMockWorkspace = require('./../support/useMockWorkspace');
const constants        = require('./../../constants.json');

const path     = require('path');
const bluebird = require('bluebird');

const fs = bluebird.promisifyAll(require('fs'));

describe('write-info', () => {

    let mockWorkspace = useMockWorkspace();

    before(mockWorkspace.before);
    after(mockWorkspace.after);
    beforeEach(mockWorkspace.copy);

    it(`should write some data to ${constants.buildInfoFile}`, async () => {

        process.chdir(mockWorkspace.tmp);

        await (new WriteInfo()).executeCli({'predictable-metafiles': true});
        const data = await fs.readFileAsync(path.join(mockWorkspace.tmp, constants.buildInfoFile));
        let result = JSON.parse(data);
        result.should.have.property('hash');
        result.should.have.property('tag');

    }).timeout(10000);
});