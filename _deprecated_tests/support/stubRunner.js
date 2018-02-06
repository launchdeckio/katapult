'use strict';

const sinon = require('sinon');

module.exports = Runner => {

    Runner.history = [];
    sinon.stub(Runner.prototype, 'run').callsFake(commands => {
        for (let command of commands) Runner.history.push(command.directive.command);
    });

    return () => Runner.prototype.run.restore();
};