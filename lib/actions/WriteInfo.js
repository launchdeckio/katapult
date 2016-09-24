'use strict';

const path         = require('path');
const pify         = require('pify');
const sprintf      = require('sprintf-js').sprintf;
const gitDescribe  = pify(require('git-describe').gitDescribe);
const Promise      = require('bluebird');
const fs           = require('q-io/fs');
const _            = require('lodash');
const randomString = require('randomstring');

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class WriteInfo extends Action {

    getBuildInfo() {
        var cwd = process.cwd();
        return Promise.all([
            gitDescribe(cwd),
            {created: (new Date()).getTime()}
        ]).then(results => _.merge.apply(this, results));
    }

    getAvailableOptions() {
        return super.getAvailableOptions().concat([
            require('./../cli/options/predictableMetafiles')
        ]);
    }

    getFilename(random) {
        return !random ? constants.buildInfoFile : sprintf(constants.buildInfoFileRand, randomString.generate(7));
    }

    run(context, options) {
        return this.getBuildInfo().then(info => fs.write(this.getFilename(!context.predictableMetaFiles), JSON.stringify(info, null, 2)));
    }
}
WriteInfo.description = sprintf("Generates a %s file at the current working directory.", constants.buildInfoFile);

module.exports = WriteInfo;