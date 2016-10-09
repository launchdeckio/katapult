'use strict';

const BaseReporter              = require('shipment').Reporter;
const monitorProcessCliReporter = require('shipment-monitor-process').reportCli;

class Reporter extends BaseReporter {
}

Reporter.cliReporters = [monitorProcessCliReporter];

module.exports = Reporter;