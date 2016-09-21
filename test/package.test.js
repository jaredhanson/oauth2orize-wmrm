/* global describe, it */

var chai = require('chai');
var wmrm = require('..');


describe('oauth2orize-wmrm', function() {
  
  it('should export function', function() {
    expect(wmrm).to.be.an('function');
  });
  
  // https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-5.2
  describe('responding to a request', function() {
    var response, err;

    before(function(done) {
      chai.connect.use(function(req, res) {
          var params = {
            code: 'SplxlOBeZQQYbYS6WxSbIA',
            state: req.oauth2.req.state
          };
        
          wmrm(req.oauth2, res, params);
        })
        .req(function(req) {
          req.oauth2 = {};
          req.oauth2.redirectURI = 'https://client.example.com';
          req.oauth2.req = { response_type: 'code', response_mode: 'web_message', state: 'xyz' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('text/html;charset=UTF-8');
      expect(response.getHeader('Cache-Control')).to.equal('no-cache, no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal(
'<!DOCTYPE html>' +
'<html>' +
'<head>' + 
  '<title>Authorization Response</title>' +
'</head>' +
'<body>' +
  '<script type="text/javascript">' +
    '(function(window, document) {' +
      'var redirectURI = "https://client.example.com";' +
      'var webMessageRequest = {};' +
      'var authorizationResponse = {' +
        'type: "authorization_response",' +
        'response: {' +
          '"code":"SplxlOBeZQQYbYS6WxSbIA",' +
          '"state":"xyz"' +
        '}' +
      '};' +
      'var mainWin = (window.opener) ? window.opener : window.parent;' +
      'if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {' +
        'window.addEventListener("message", function(evt) {' +
          'if (evt.origin != redirectURI)' +
            'return;' +
          'switch (evt.data.type) {' +
            'case "relay_response":' +
              'messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +
              'messageTargetWindow.postMessage({' +
                'type: "authorization_response",' +
                'response: authorizationResponse' +
              '}, webMessageRequest["web_message_uri"]);' +
              'break;' +
          '}' +
        '});' +
        'mainWin.postMessage({' +
          'type: "relay_request"' +
        '}, redirectURI);' +
      '} else {' +
        'mainWin.postMessage({' +
          'type: "authorization_response",' +
          'response: authorizationResponse' +
        '}, redirectURI);' +
      '}' +
    '})(this, this.document);' +
  '</script>' +
'</body>' +
'</html>');
    });
  });
  
});
