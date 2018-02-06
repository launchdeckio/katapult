'use strict';

const constants = require('./../../../constants.json');

const configFile = constants.configFile,
    ignoreFile = constants.ignoreFile;

const mockFs = {
    'tmp': {
        'a':      {
            'b': {
                'c':      {
                    d: ''
                },
                'danger': {}
            }
        },
        'danger': {
            e: ''
        }
    }
};

mockFs['tmp'][ignoreFile]                = '!a/b\na/b/danger';
mockFs['tmp']['a'][configFile]           = '';
mockFs['tmp']['a']['b'][configFile]      = '';
mockFs['tmp']['a']['b']['c'][configFile] = '';

mockFs['tmp']['danger'][configFile]           = '';
mockFs['tmp']['a']['b']['danger'][configFile] = '';

module.exports = mockFs;