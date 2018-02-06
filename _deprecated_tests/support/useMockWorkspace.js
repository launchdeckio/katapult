'use strict';

const MockWorkspace = require('./MockWorkspace');

const path = require('path');

module.exports = () => {

    let mockWorkspace;

    return {
        before() {
            this.timeout(10000);
            mockWorkspace = new MockWorkspace(path.resolve(__dirname + '/../test-tmp'));
            return mockWorkspace.setup();
        },
        after() {
            this.timeout(10000);
            return mockWorkspace.tearDown();
        },
        copy() {
            return mockWorkspace.copy();
        },
        get tmp() {
            return mockWorkspace.getTmp();
        }
    };
};