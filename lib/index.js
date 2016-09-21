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
      'var redirectURI = "{TARGET_ORIGIN}";' +
      'var webMessageRequest = {WEB_MESSAGE_REQUEST};' +
      'var authorizationResponse = {' +
        'type: "authorization_response",' +
        'response: {RESPONSE}' +
      '};' +
      'var mainWin = (window.opener) ? window.opener : window.parent;' +
      'if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {' +
        'window.addEventListener("message", function(evt) {' +
          'if (evt.origin != redirectURI)' +
            'return;' +
          'switch (evt.data.type) {' +
            'case "relay_response":' +  // 
              'var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +
              'if (messageTargetWindow) {' +
                'messageTargetWindow.postMessage({' +
                  'type: "authorization_response",' +
                  'response: authorizationResponse' +
                '}, webMessageRequest["web_message_uri"]);' +
              '}' +
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
'</html>';


// https://github.com/nov/oauth-wmrm-sample
// http://www.slideshare.net/zigorou/oauth-20-web-messaging-response-mode-openid-summit-tokyo-2015

// http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html

exports = module.exports = function (txn, res, params) {
  console.log('TODO: RESPOND USING WMRM WHOO!...');
  
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');

  console.log(txn);
  console.log(params);

  var wmr = JSON.stringify({ web_message_uri: txn.req.webMessageURI, web_message_target: txn.req.webMessageTarget });

  return res.end(html.replace('{TARGET_ORIGIN}', txn.redirectURI).replace('{WEB_MESSAGE_REQUEST}', wmr).replace('{RESPONSE}', JSON.stringify(params)));
}

exports.extensions = require('./request/extensions');
