var chai = require('chai')
  , extensions = require('../../lib/request/extensions')
  , qs = require('querystring')


describe('authorization request extensions', function() {
  
  describe('module', function() {
    var mod = extensions();
    
    it('should be wildcard', function() {
      expect(mod.name).to.equal('*');
    });
    
    it('should expose request and response functions', function() {
      expect(mod.request).to.be.a('function');
      expect(mod.response).to.be.undefined;
    });
  });
  
  describe('request parsing', function() {
    
    describe('request with all parameters', function() {
      var err, ext;
      
      before(function(done) {
        chai.oauth2orize.grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.web_message_uri = 'https://api.example.com';
            req.query.web_message_target = 'apiFrame';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });
      
      it('should not error', function() {
        expect(err).to.be.null;
      });
      
      it('should parse request', function() {
        expect(ext.webMessageURI).to.equal('https://api.example.com');
        expect(ext.webMessageTarget).to.equal('apiFrame');
      });
    });
    
    describe('request without parameters', function() {
      var err, ext;
      
      before(function(done) {
        chai.oauth2orize.grant(extensions())
          .req(function(req) {
            req.query = {};
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });
      
      it('should not error', function() {
        expect(err).to.be.null;
      });
      
      it('should parse request', function() {
        expect(ext.webMessageURI).to.be.undefined;
        expect(ext.webMessageTarget).to.be.undefined;
      });
    });
    
  });

});