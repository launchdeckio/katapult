'use strict';

const CommandRunnerAction = require('./common/CommandRunnerAction');

class RunInstall extends CommandRunnerAction {

    run(context, options) {
        return options.buildTree.install(context);
    }
}
RunInstall.description = 'Recursively runs the "install" directives starting at the current working directory.';

module.exports = RunInstall;