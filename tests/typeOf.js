/*global describe, it */
"use strict";

var expect = require('chai').expect;

var TYPEOF = require("../index.js").typeOf;

describe('Does typeOf return the right value?', function () {

    it('Function', function () {
        expect(TYPEOF(function() {})).be.eql('function');
    });

    it('Array', function () {
        expect(TYPEOF([])).be.equal('array');
    });

    it('undefined', function () {
        expect(TYPEOF(undefined)).be.equal('undefined');
    });

    it('Number', function () {
        expect(TYPEOF(1)).be.equal('number');
    });

    it('Boolean', function () {
        expect(TYPEOF(true)).be.equal('boolean');
    });

    it('String', function () {
        expect(TYPEOF('Parcela')).be.equal('string');
    });

    it('RegExp', function () {
        expect(TYPEOF(/^a/)).be.equal('regexp');
    });

    it('Date', function () {
        expect(TYPEOF(new Date())).be.equal('date');
    });

    it('Error', function () {
        expect(TYPEOF(new Error())).be.equal('error');
    });

});