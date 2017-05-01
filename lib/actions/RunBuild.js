'use strict';

const CommandRunnerAction = require('./CommandRunnerAction');

class RunBuild extends CommandRunnerAction {

    run(context, options) {
        return options.buildTree.build(context);
    }
}
RunBuild.description = 'Recursively runs the "build" directives starting at the current working directory.';

module.exports = RunBuild;