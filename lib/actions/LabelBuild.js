'use strict';

const sprintf     = require('sprintf-js').sprintf;
const gitDescribe = require('git-describe').gitDescribe;
const Promise     = require('bluebird');
const fs          = require('q-io/fs');
const _           = require('lodash');

const Action    = require('./../Action');
const constants = require('./../../constants.json');

class LabelBuild extends Action {

    getDescription() {
        return sprintf("Generates a %s file at the current working directory.", constants.buildInfoFile);
    }

    run(context, options) {
        return new Promise((resolve, reject) => {
            gitDescribe(process.cwd(), (err, info) => {
                if (err) reject(err);
                _.assign(info, {created: (new Date()).getTime()});
                resolve(fs.write(constants.buildInfoFile, JSON.stringify(info, null, 2)));
            });
        });
    }
}

module.exports = LabelBuild;