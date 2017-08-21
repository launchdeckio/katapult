'use strict';

require('./support/support');

const sinon       = require('sinon');
const rewire      = require('rewire');
const path        = require('path');
const MockFs      = require('q-io/fs-mock');
const classicMock = require('mock-fs');

const ScannedBuildTree = rewire('./../lib/ScannedBuildTree');
const Context          = require('../lib/common/Context');
const Runner           = require('../lib/common/Runner');
const constants        = require('./../constants.json');

const configFile = constants.configFile;
const ignoreFile = constants.ignoreFile;

let defaultfs = require('q-io/fs');

const setupMockFs = function (mockFs) {
    ScannedBuildTree.__set__('fs', MockFs(mockFs));
    classicMock(mockFs);
};

const teardownMockFs = function () {
    classicMock.restore();
    ScannedBuildTree.__set__('fs', defaultfs);
};

const expected = [
    path.join('tmp', 'a', configFile),
    path.join('tmp', 'a', 'b', configFile),
    path.join('tmp', 'a', 'b', 'c', configFile)
];

describe('ScannedBuildTree', () => {

    describe('getConfigFiles()', () => {

        it('should get an array of the config files present in the given directory', function () {
            setupMockFs(require('./fixtures/filesystems/testIgnores'));
            return ScannedBuildTree.getConfigFiles('tmp').should.eventually.deep.equal(expected);
        });

        it('should work with a .katapultignore blacklist', function () {
            setupMockFs(require('./fixtures/filesystems/testIgnoreBlacklist'));
            return ScannedBuildTree.getConfigFiles('tmp').should.eventually.deep.equal(expected);
        });

        afterEach(function () {
            teardownMockFs();
        });
    });

    describe('end-to-end', () => {

        let history;

        const simulatedRoot = __dirname + '/fixtures/simulated';

        beforeEach(() => {
            history = [];
            sinon.stub(Runner.prototype, 'run').callsFake(commands => {
                for (let command of commands) history.push(command.directive.command);
            });
        });

        afterEach(() => {
            Runner.prototype.run.restore();
        });

        it('should run the commands in the right order', async () => {
            // process.chdir(simulatedRoot);
            const ctx = new Context();
            await (new ScannedBuildTree(simulatedRoot)).install(ctx);
            await (new ScannedBuildTree(simulatedRoot)).build(ctx);
            history.should.eql([
                'echo "install root"',
                'echo "install public"',
                'echo "build public"',
                'echo "build root"',
            ]);
        });
    });
});