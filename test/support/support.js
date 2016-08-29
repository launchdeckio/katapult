'use strict';

const chai           = require("chai");
const sinonChai      = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

const Promise        = require('bluebird');
const readAsPromised = Promise.promisify(require('fs').readFile);
const sinon          = require('sinon');

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.should();