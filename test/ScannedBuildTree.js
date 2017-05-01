'use strict';

require('./support/support');

const rewire           = require('rewire');
const path             = require('path');
const ScannedBuildTree = rewire('./../lib/ScannedBuildTree');
const MockFs           = require('q-io/fs-mock');
const classicMock      = require('mock-fs');
const constants        = require('./../constants.json');

const configFile = constants.configFile;
const ignoreFile = constants.ignoreFile;

const setupMockFs = function (mockFs) {
    ScannedBuildTree.__set__('fs', MockFs(mockFs));
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

    describe('scanTree()', () => {

        // it('should ')
    });
});