'use strict';

const pify   = require('pify');
const dirsum = pify(require('dirsum').digest);

const BuildpathAction = require('./common/BuildpathAction');

class ReadSum extends BuildpathAction {

    run(context) {
        return dirsum(context.buildpath);
    }
}

ReadSum.description = 'Read (recursive) file hashes.';

module.exports = ReadSum;