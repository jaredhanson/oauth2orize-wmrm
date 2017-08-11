/* global describe, it */

var chai = require('chai');
var wmrm = require('..');


describe('oauth2orize-wmrm', function() {
  
  it('should export function', function() {
    expect(wmrm).to.be.an('function');
  });
  
  // https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-5.2
  describe('responding to simple request', function() {
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
          //req.oauth2.redirectURI = 'https://client.example.com';
          req.oauth2.webOrigin = 'https://client.example.com';
          req.oauth2.req = { responseType: 'code', responseMode: 'web_message', state: 'xyz' };
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
      'var targetOrigin = "https://client.example.com";' +
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
          'if (evt.origin != targetOrigin)' +
            'return;' +
          'switch (evt.data.type) {' +
            'case "relay_response":' +
              'var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +
              'if (messageTargetWindow) {' +
                'messageTargetWindow.postMessage(authorizationResponse, webMessageRequest["web_message_uri"]);' +
                'window.close();' +
              '}' +
              'break;' +
          '}' +
        '});' +
        'mainWin.postMessage({' +
          'type: "relay_request"' +
        '}, targetOrigin);' +
      '} else {' +
        'mainWin.postMessage(authorizationResponse, targetOrigin);' +
      '}' +
    '})(this, this.document);' +
  '</script>' +
'</body>' +
'</html>');
    });
  });
  
  describe('responding to relay request', function() {
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
          //req.oauth2.redirectURI = 'https://client.example.com';
          req.oauth2.webOrigin = 'https://client.example.com';
          req.oauth2.req = { responseType: 'code', responseMode: 'web_message',
            webMessageURI: 'https://api.example.com',
            webMessageTarget: 'apiFrame',
            state: 'xyz' };
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
      'var targetOrigin = "https://client.example.com";' +
      'var webMessageRequest = {' +
        '"web_message_uri":"https://api.example.com",' +
        '"web_message_target":"apiFrame"' +
      '};' +
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
          'if (evt.origin != targetOrigin)' +
            'return;' +
          'switch (evt.data.type) {' +
            'case "relay_response":' +
              'var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +
              'if (messageTargetWindow) {' +
                'messageTargetWindow.postMessage(authorizationResponse, webMessageRequest["web_message_uri"]);' +
                'window.close();' +
              '}' +
              'break;' +
          '}' +
        '});' +
        'mainWin.postMessage({' +
          'type: "relay_request"' +
        '}, targetOrigin);' +
      '} else {' +
        'mainWin.postMessage(authorizationResponse, targetOrigin);' +
      '}' +
    '})(this, this.document);' +
  '</script>' +
'</body>' +
'</html>');
    });
  });
  
});
