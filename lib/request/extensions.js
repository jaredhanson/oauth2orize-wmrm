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
    
    return ext;
  }
  
  var mod = {};
  mod.name = '*';
  mod.request = request;
  return mod;
}
