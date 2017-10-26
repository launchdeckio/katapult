'use strict';

require('./../support');

const LocalAgent = require('../../lib/io/LocalAgent');

describe('LocalAgent', () => {

    it('scans a directory for files on the local machine', async () => {

        const agent = new LocalAgent();

        const files = await agent.dir(__dirname + '/../fixtures/simulated');

        files.should.eql([
            {name: '.katapult.yml', isDirectory: false},
            {name: 'public', isDirectory: true}
        ]);
    });
});