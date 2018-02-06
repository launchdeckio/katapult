'use strict';

require('./../support');

const LocalAgent = require('../../lib/io/LocalAgent');

describe('LocalAgent', () => {

    it('scans a directory for files on the local machine', async () => {

        const agent = new LocalAgent();

        const files = await agent.dir(__dirname + '/../fixtures/simulated');

        files.should.have.length(2);

        files[0].name.should.equal('.katapult.yml');
        files[1].name.should.equal('public');
        files[0].should.have.property('stat');
        files[1].should.have.property('stat');
    });
});