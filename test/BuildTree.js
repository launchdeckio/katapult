'use strict';

require('./support/support');

var rewire      = require('rewire'),
    path        = require('path'),
    BuildTree   = rewire('./../lib/BuildTree'),
    MockFs      = require('q-io/fs-mock'),
    classicMock = require('mock-fs');

var constants = require('./../constants.json');

var configFile = constants.configFile,
    ignoreFile = constants.ignorefile;

var setupMockFs = function (mockFs) {
    BuildTree.__set__('fs', MockFs(mockFs));
    classicMock(mockFs);
};

var teardownMockFs = function () {
    classicMock.restore();
};

var expected = [
    path.join('tmp', 'a', configFile),
    path.join('tmp', 'a', 'b', configFile),
    path.join('tmp', 'a', 'b', 'c', configFile)
];

describe('BuildTree', function () {

    describe('getConfigFiles()', function () {

        it('should get an array of the config files present in the given directory', function () {
            setupMockFs(require('./resources/filesystems/testIgnores'));
            return BuildTree.getConfigFiles('tmp').should.eventually.deep.equal(expected);
        });

        it('should work with a .katapultignore blacklist', function () {
            setupMockFs(require('./resources/filesystems/testIgnoreBlacklist'));
            return BuildTree.getConfigFiles('tmp').should.eventually.deep.equal(expected);
        });

        afterEach(function () {
            teardownMockFs();
        });

    });

});