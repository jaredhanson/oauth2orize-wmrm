/**
 * Parse request parameters defined by Web Message response mode.
 *
 * This module is a wildcard parser that parses authorization requests for
 * extensions parameters defined by Web Message response mode.
 *
 * Examples:
 *
 *     server.grant(wmrm.extensions());
 *
 * References:
 *  - [OAuth 2.0 Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00)
 *
 * @return {Object} module
 * @api public
 */
module.exports = function() {
  
  function request(req) {
    var q = req.query
      , ext = {};
    
    if (q.web_message_uri) {
      ext.webMessageURI = q.web_message_uri;
    }
    if (q.web_message_target) {
      ext.webMessageTarget = q.web_message_target;
    }
    if (q.response_mode) {
      ext.responseMode = q.response_mode;
    }
    
    return ext;
  }
  
  var mod = {};
  mod.name = '*';
  mod.request = request;
  return mod;
}
