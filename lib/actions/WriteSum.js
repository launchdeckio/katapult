'use strict';

const pify    = require('pify');
const sprintf = require('sprintf-js').sprintf;
const fs      = require('q-io/fs');
const dirsum  = pify(require('dirsum').digest);

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class WriteSum extends Action {

    run(context, options) {
        return dirsum(process.cwd()).then(hashes => fs.write(constants.sumFile, JSON.stringify(hashes, null, 2)));
    }
}
WriteSum.description = sprintf("Generates a %s file at the current working directory.", constants.sumFile);

module.exports = WriteSum;