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

const support = {

    /**
     * Wires up module with the provided mock response data
     * @param {*} module
     * @param {Number} responseCode
     * @param {string} [contentsFile] The file to read the response body from
     * @param {sinon.match} [withArgs] Optional matcher to use. If provided, the default response will be set to a 404 response
     */
    setupHttpMock: function (module, responseCode, contentsFile, withArgs) {
        var httpMock           = {};
        var createMockResponse = function (responseCode, contentsFile) {
            var promiseForContents = contentsFile ?
                readAsPromised(contentsFile) :
                Promise.resolve('');
            return {
                status: responseCode,
                body:   {
                    read: sinon.stub().returns(promiseForContents)
                }
            };
        };

        var stub    = sinon.stub();
        var subStub = withArgs ? stub.withArgs(withArgs) : stub;
        subStub.returns(Promise.resolve(createMockResponse(responseCode, contentsFile)));
        if (withArgs) stub.returns(Promise.resolve(createMockResponse(404)));
        httpMock.request = stub;
        module.__set__('http', httpMock);
        return httpMock;
    }
};

module.exports = support;