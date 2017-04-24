'use strict';

const pify         = require('pify');
const sprintf      = require('sprintf-js').sprintf;
const fs           = require('q-io/fs');
const dirsum       = pify(require('dirsum').digest);
const randomString = require('randomstring');

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class WriteSum extends Action {

    getAvailableOptions() {
        return super.getAvailableOptions().concat([
            require('./../cli/options/predictableMetafiles')
        ]);
    }

    getFilename(random) {
        return !random ? constants.sumFile : sprintf(constants.sumFileRand, randomString.generate(7));
    }

    run(context) {
        return dirsum(process.cwd())
            .then(hashes => {
                const filename = this.getFilename(!context.predictableMetaFiles);
                const data     = JSON.stringify(hashes, null, 2);
                return fs.write(filename, data).then(() => hashes);
            });
    }
}
WriteSum.description = `Generates a ${constants.sumFile} file at the current working directory.`;

module.exports = WriteSum;