// 127.0.0.1:8080/oauth2/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Freturn&client_id=1&response_mode=web_message

var html =
'<!DOCTYPE html>' +
'<html>' +
'<head>' +
  '<title>Authorization Response</title>' +
'</head>' +
'<body>' +
  '<script type="text/javascript">' +
    '(function(window, document) {' +
      'var targetOrigin = "{TARGET_ORIGIN}";' +
      'var webMessageRequest = {WEB_MESSAGE_REQUEST};' +
      'var authorizationResponse = {' +
        'type: "authorization_response",' +
        'response: {RESPONSE}' +
      '};' +
      'var mainWin = (window.opener) ? window.opener : window.parent;' +
      'if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {' +
        'window.addEventListener("message", function(evt) {' +
          'if (evt.origin != targetOrigin)' +
            'return;' +
          'switch (evt.data.type) {' +
            'case "relay_response":' +  // 
              'var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +
              'if (messageTargetWindow) {' +
                'messageTargetWindow.postMessage({' +
                  'type: "authorization_response",' +
                  'response: authorizationResponse' +
                '}, webMessageRequest["web_message_uri"]);' +
                'window.close();' +
              '}' +
            'break;' +
          '}' +
        '});' +
        'mainWin.postMessage({' +
          'type: "relay_request"' +
        '}, targetOrigin);' +
      '} else {' +
        'mainWin.postMessage({' +
          'type: "authorization_response",' +
          'response: authorizationResponse' +
        '}, targetOrigin);' +
      '}' +
    '})(this, this.document);' +
  '</script>' +
'</body>' +
'</html>';


// https://github.com/nov/oauth-wmrm-sample
// http://www.slideshare.net/zigorou/oauth-20-web-messaging-response-mode-openid-summit-tokyo-2015
// http://developer.okta.com/docs/api/resources/oauth2.html#postmessage-data-model
// http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html

// http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20111121/001308.html
// https://github.com/princed/oauth2-postmessage-profile
// http://www.riskcompletefailure.com/2013/03/postmessage-oauth-20.html

exports = module.exports = function (txn, res, params) {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');
  
  var to = txn.webOrigin;
  var wmr = JSON.stringify({ web_message_uri: txn.req.webMessageURI, web_message_target: txn.req.webMessageTarget });

  return res.end(html.replace('{TARGET_ORIGIN}', to).replace('{WEB_MESSAGE_REQUEST}', wmr).replace('{RESPONSE}', JSON.stringify(params)));
}

exports.validate = function(txn) {
  if (!txn.webOrigin) { throw new Error('Unable to post message for OAuth 2.0 transaction'); }
};


exports.extensions = require('./request/extensions');
