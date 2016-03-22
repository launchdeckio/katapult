'use strict';

var constants = require('./../../../constants.json');

var configFile = constants.configFile,
    ignoreFile = constants.ignorefile;

var mockFs = {
    'tmp': {
        'a':      {
            'b': {
                'c': {
                    'd': ''
                }
            }
        },
        'danger': {
            'e': ''
        }
    }
};

mockFs['tmp'][ignoreFile]                = 'danger';
mockFs['tmp']['a'][configFile]           = '';
mockFs['tmp']['a']['b'][configFile]      = '';
mockFs['tmp']['a']['b']['c'][configFile] = '';

mockFs['tmp']['danger'][configFile] = '';

module.exports = mockFs;