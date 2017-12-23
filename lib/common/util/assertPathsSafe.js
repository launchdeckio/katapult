'use strict';

module.exports = paths => paths.forEach(path => {
    if (path.includes('..') || path.startsWith('/'))
        throw new Error('Path contains ".." or starts with "/".');
});