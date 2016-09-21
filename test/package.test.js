/* global describe, it */

var expect = require('chai').expect;
var wmrm = require('..');


describe('oauth2orize-wmrm', function() {
  
  it('should export function', function() {
    expect(wmrm).to.be.an('function');
  });
  
});
