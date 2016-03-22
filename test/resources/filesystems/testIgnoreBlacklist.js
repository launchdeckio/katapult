'use strict';

var constants = require('./../../../constants.json');

var configFile = constants.configFile,
    ignoreFile = constants.ignorefile;

var mockFs = {
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