'use strict';

const pify         = require('pify');
const sprintf      = require('sprintf-js').sprintf;
const gitDescribe  = pify(require('git-describe').gitDescribe);
const Promise      = require('bluebird');
const _            = require('lodash');
const randomString = require('randomstring');

const BuildpathAction = require('./common/BuildpathAction');
const constants       = require('./../../constants.json');

class WriteInfo extends BuildpathAction {

    getBuildInfo(cwd) {
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
        const info     = await this.getBuildInfo(context.buildpath);
        const filename = WriteInfo.getFilename(!context.predictableMetaFiles);
        const data     = JSON.stringify(info, null, 2);
        await context.agent.write(filename, data);
        return data;
    }
}

WriteInfo.description = `Generates a ${constants.buildInfoFile} file at the current working directory.`;

module.exports = WriteInfo;