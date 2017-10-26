'use strict';

const pify         = require('pify');
const sprintf      = require('sprintf-js').sprintf;
const gitDescribe  = pify(require('git-describe').gitDescribe);
const Promise      = require('bluebird');
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

    static getFilename(random) {
        return !random ? constants.buildInfoFile : sprintf(constants.buildInfoFileRand, randomString.generate(7));
    }

    async run(context) {
        const info     = await this.getBuildInfo();
        const filename = WriteInfo.getFilename(!context.predictableMetaFiles);
        const data     = JSON.stringify(info, null, 2);
        await context.agent.write(filename, data);
        return data;
    }
}

WriteInfo.description = `Generates a ${constants.buildInfoFile} file at the current working directory.`;

module.exports = WriteInfo;