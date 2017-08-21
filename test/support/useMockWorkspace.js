'use strict';

const MockWorkspace = require('./MockWorkspace');

const path = require('path');

module.exports = () => {

    let mockWorkspace;

    return {
        before: function () {
            this.timeout(10000);
            mockWorkspace = new MockWorkspace(path.resolve(__dirname + '/../test-tmp'));
            return mockWorkspace.setup();
        },
        after:  function () {
            this.timeout(10000);
            return mockWorkspace.tearDown();
        },
        get:    () => mockWorkspace,
    };
};