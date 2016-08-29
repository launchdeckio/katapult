'use strict';

require('./../../support/support');

const parseDirective = require('./../../../lib/common/util/parseDirective');

const _                  = require('lodash');
const Directive          = require('./../../../lib/common/commands/Directive');

describe('parseDirective', () => {

    it('should throw an error for invalid inputs', () => {

        (() => parseDirective(null)).should.throw(TypeError);
        (() => parseDirective(true)).should.throw(TypeError);
        (() => parseDirective({})).should.throw(TypeError);
        (() => parseDirective({'foo': 'bar'})).should.throw(TypeError);
    });

    it('should parse "simple" directives into an instance of Directive', () => {

        _.forEach(['npm i', {cmd: 'npm i'}], obj => {

            const directive = parseDirective(obj);
            directive.should.be.an.instanceof(Directive);
            directive.command.should.eql('npm i');
        });
    });
});