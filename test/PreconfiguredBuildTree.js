'use strict';

require('./support/support');

const Runner     = require('../lib/common/Runner');
const stubRunner = require('./support/stubRunner');
const Context    = require('./../lib/common/Context');

const PreconfiguredBuildTree = require('../lib/PreconfiguredBuildTree');

describe('PreconfiguredBuildTree', () => {

    let revert;

    beforeEach(() => {
        revert = stubRunner(Runner);
    });

    afterEach(() => {
        revert();
    });

    it('should run the commands provided in the config', async () => {

        const simulatedRoot = __dirname + '/fixtures/simulated';

        let tree = PreconfiguredBuildTree.create(simulatedRoot, `
install:
    - npm install
    - cmd: composer install
      input: package.json
      output: vendor

build:
    - npm run prod
        `);

        const ctx = new Context();

        await tree.install(ctx);
        await tree.build(ctx);

        Runner.history.should.eql(['npm install', 'composer install', 'npm run prod']);
    });
});