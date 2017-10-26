'use strict';

require('./support');

const path        = require('path');
const classicMock = require('mock-fs');

const ScannedBuildTree = require('./../lib/ScannedBuildTree');
const stubRunner       = require('./support/stubRunner');
const Context          = require('../lib/common/Context');
const Runner           = require('../lib/common/Runner');
const constants        = require('./../constants.json');

const configFile = constants.configFile;
const ignoreFile = constants.ignoreFile;

const setupMockFs = function (mockFs) {
    classicMock(mockFs);
};

const teardownMockFs = function () {
    classicMock.restore();
};

const expected = [
    path.join('tmp', 'a', configFile),
    path.join('tmp', 'a', 'b', configFile),
    path.join('tmp', 'a', 'b', 'c', configFile)
];

describe('ScannedBuildTree', () => {

    describe('getConfigFiles()', () => {

        let context;

        beforeEach(() => {
            context = new Context();
        });

        it('should get an array of the config files present in the given directory', function () {
            setupMockFs(require('./fixtures/filesystems/testIgnores'));
            return ScannedBuildTree.getConfigFiles(context, 'tmp').should.eventually.deep.equal(expected);
        });

        it('should work with a .katapultignore blacklist', function () {
            setupMockFs(require('./fixtures/filesystems/testIgnoreBlacklist'));
            return ScannedBuildTree.getConfigFiles(context, 'tmp').should.eventually.deep.equal(expected);
        });

        afterEach(function () {
            teardownMockFs();
        });
    });

    describe('end-to-end', () => {

        let revert;

        const simulatedRoot = __dirname + '/fixtures/simulated';

        beforeEach(() => {
            revert = stubRunner(Runner);
        });

        afterEach(() => {
            revert();
        });

        it('should run the commands in the right order', async () => {
            const ctx  = new Context();
            const tree = new ScannedBuildTree(simulatedRoot);
            await tree.install(ctx);
            await tree.build(ctx);
            Runner.history.should.eql([
                'echo "install root"',
                'echo "install public"',
                'echo "build public"',
                'echo "build root"',
            ]);
        });
    });
});