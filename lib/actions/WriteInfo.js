'use strict';

const path        = require('path');
const pify        = require('pify');
const sprintf     = require('sprintf-js').sprintf;
const gitDescribe = pify(require('git-describe').gitDescribe);
const Promise     = require('bluebird');
const fs          = require('q-io/fs');
const _           = require('lodash');

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class WriteInfo extends Action {

    getDescription() {
        return sprintf("Generates a %s file at the current working directory.", constants.buildInfoFile);
    }

    getBuildInfo() {
        var cwd = process.cwd();
        return Promise.all([
            gitDescribe(cwd),
            {created: (new Date()).getTime()}
        ]).then(results => _.merge.apply(this, results));
    }

    run(context, options) {
        return this.getBuildInfo().then(info => fs.write(constants.buildInfoFile, JSON.stringify(info, null, 2)));
    }
}

module.exports = WriteInfo;