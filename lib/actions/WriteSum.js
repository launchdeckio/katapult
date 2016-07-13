'use strict';

const pify    = require('pify');
const sprintf = require('sprintf-js').sprintf;
const fs      = require('q-io/fs');
const dirsum  = pify(require('dirsum').digest);

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class WriteSum extends Action {

    getDescription() {
        return sprintf("Generates a %s file at the current working directory.", constants.sumFile);
    }

    run(context, options) {
        return dirsum(process.cwd()).then(hashes => fs.write(constants.sumFile, JSON.stringify(hashes, null, 2)));
    }
}

module.exports = WriteSum;