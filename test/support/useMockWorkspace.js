'use strict';

const MockWorkspace = require('./MockWorkspace');

module.exports = (before, after) => {

    let mockWorkspace;

    before(function () {

        this.timeout(10000);
        mockWorkspace = new MockWorkspace(__dirname);
        return mockWorkspace.setup();
    });

    after(function () {

        this.timeout(10000);
        return mockWorkspace.tearDown();
    });

    return () => mockWorkspace;
};