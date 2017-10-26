'use strict';

require('./../../support');

const ls     = require('../../../lib/common/util/ls');
const deepLs = require('../../../lib/common/util/deepLs');

describe('deepLs', () => {

    it('should create a "deep" directory listing', async () => {

        const files = await deepLs(__dirname + "/..", ls);

        // console.log(files);
    });
});