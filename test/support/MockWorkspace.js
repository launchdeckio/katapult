'use strict';

const pify   = require('pify');
const mkdirp = pify(require('mkdirp'));
const path   = require('path');
const execa  = require('execa');

class MockWorkspace {

    constructor(cwd) {
        this.workspace = '.' + (new Date()).getTime();
        this.root      = path.join(cwd, this.workspace);
    }

    run(cmd) {
        return mkdirp(this.root).then(() => execa.shell(cmd, {
            cwd: this.root
        }))
    }

    setup() {
        return this.run('git clone https://github.com/jmversteeg/katapult-test.git');
    }

    copy() {
        return this.run('rm -rf katapult-test-tmp && cp -R katapult-test katapult-test-tmp');
    }

    getTmp() {
        return path.join(this.root, 'katapult-test-tmp');
    }

    tearDown() {
        return this.run('rm -rf ../' + this.workspace);
    }
}

module.exports = MockWorkspace;