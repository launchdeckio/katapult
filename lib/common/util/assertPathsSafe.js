'use strict';

const assert = require('assert');

const {isArray} = require('lodash');

module.exports = (paths, allowAbsolute = false) => {

    assert(isArray(paths), '"paths" must be an array.');

    paths.forEach(path => {

        assert(!path.includes('..'), 'Path may not include ".."');
        assert(!path.includes(' '), 'Path may not include " "');
        assert(allowAbsolute || !path.startsWith('/'), 'Path should not start with "/"');
    });
};