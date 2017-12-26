'use strict';

module.exports = paths => paths.forEach(path => {
    if (path.includes('..') || path.includes(' ') || path.startsWith('/'))
        throw new Error('Path contains "..", " " (space) or starts with "/".');
});