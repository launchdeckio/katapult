'use strict';

const pify   = require('pify');
const mkdirp = require('make-dir');
const path   = require('path');
const execa  = require('execa');

class MockWorkspace {

    constructor(cwd) {
        this.root = path.join(cwd, '.' + (new Date()).getTime());
    }

    /**
     * Run given command in the mock workspace
     * @param cmd
     * @returns {Promise.<void>}
     */
    async run(cmd) {
        await mkdirp(this.root);
        return execa.shell(cmd, {
            cwd: this.root
        });
    }

    /**
     * (before hook)
     * @returns {*}
     */
    setup() {
        return this.run('git clone https://github.com/jmversteeg/katapult-test.git');
    }

    copy() {
        return this.run('rm -rf katapult-test-tmp && cp -R katapult-test katapult-test-tmp');
    }

    /**
     * Get the path to the "tmp" destination directory
     */
    getTmp() {
        return path.join(this.root, 'katapult-test-tmp');
    }

    /**
     * (after hook)
     * @returns {*}
     */
    async tearDown() {
        await this.run(`rm -rf ${this.root}`);
        process.chdir(__dirname);
    }
}

module.exports = MockWorkspace;