'use strict';

require('./../../support/support');

const parseDirective = require('./../../../lib/common/util/parseDirective');

const expect             = require('chai').expect;
const _                  = require('lodash');
const Directive          = require('./../../../lib/common/commands/Directive');
const CacheableDirective = require('./../../../lib/common/commands/CacheableDirective');

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

    it('should parse cacheable directives into an instance of CacheableDirective', () => {

        const directive = parseDirective({
            'cmd':    'npm i',
            'input':  'package.json',
            'output': 'node_modules',
            'ttl':    '1 day'
        });

        directive.should.be.an.instanceof(CacheableDirective);
        directive.command.should.eql('npm i');
        directive.cacheOptions.should.be.an('object');
        directive.cacheOptions.input.should.deep.eql(['package.json']);
        directive.cacheOptions.output.should.deep.eql(['node_modules']);
        directive.cacheOptions.ttl.should.eql(24 * 60 * 60 * 1000);
    });

    it('should allow arrays for input and output', () => {

        const directive = parseDirective({
            'cmd':    'gulp',
            'input':  ['assets/js', 'assets/css'],
            'output': ['build/js', 'build/css'],
            'ttl':    '1 day'
        });

        directive.cacheOptions.input.should.deep.eql(['assets/js', 'assets/css']);
        directive.cacheOptions.output.should.deep.eql(['build/js', 'build/css']);
    });

    it('should allow cacheable directives without an input argument', () => {

        const directive = parseDirective({
            'cmd':    'npm i',
            'output': 'node_modules',
            'ttl':    '1 day'
        });

        expect(directive.cacheOptions.input).to.be.undefined;
    });
});