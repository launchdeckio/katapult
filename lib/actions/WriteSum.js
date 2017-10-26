'use strict';

const pify         = require('pify');
const sprintf      = require('sprintf-js').sprintf;
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

    static getFilename(random) {
        return !random ? constants.sumFile : sprintf(constants.sumFileRand, randomString.generate(7));
    }

    async run(context) {
        const hashes   = await dirsum(process.cwd());
        const filename = WriteSum.getFilename(!context.predictableMetaFiles);
        const data     = JSON.stringify(hashes, null, 2);
        await context.agent.write(filename, data);
        return hashes;
    }
}

WriteSum.description = `Generates a ${constants.sumFile} file at the current working directory.`;

module.exports = WriteSum;