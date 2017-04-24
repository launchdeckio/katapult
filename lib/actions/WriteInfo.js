'use strict';

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
        const cwd = process.cwd();
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

    run(context) {
        return this.getBuildInfo()
            .then(info => {
                const filename = this.getFilename(!context.predictableMetaFiles);
                const data     = JSON.stringify(info, null, 2);
                return fs.write(filename, data).then(() => data);
            });
    }
}
WriteInfo.description = `Generates a ${constants.buildInfoFile} file at the current working directory.`;

module.exports = WriteInfo;