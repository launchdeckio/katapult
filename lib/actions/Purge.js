'use strict';

const BuildtreeAction = require('./BuildtreeAction');

class Purge extends BuildtreeAction {

    run(context, options) {
        return options.buildTree.clean(context);
    }
}
Purge.description = 'Wipes files not needed in the build based on the the "purge" globs.';

module.exports = Purge;