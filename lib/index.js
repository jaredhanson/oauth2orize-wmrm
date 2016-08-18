var uri = require('url');

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

   // NOTE: this is a modification from the draft in case window.opener is null.
   // 'var mainWin = (window.opener != window) ? window.opener : window.parent;' +
      'var mainWin = (window.opener && (window.opener != window)) ? window.opener : window.parent;' +

      'if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {' +
        'window.addEventListener("message", function(evt) {' +
          // NOTE: This is a modification of the draft, and is a weak check. It does not protect
          // against replay attacks if the attacker shares the same hostname and port as the victim
          // This is because evt.origin does not contain the full origin, but only the root.
          'if (evt.origin != redirectURI && evt.origin != webMessageRequest["web_message_root"])' +
            'return;' +

          'switch (evt.data.type) {' +
            'case "relay_response":' +
              // NOTE: use of 'var' is modification from the draft.
              'var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];' +

              'if (messageTargetWindow) {' +
                'messageTargetWindow.postMessage({' +
                  'type: "authorization_response",' +
                  'response: authorizationResponse' +
                '}, webMessageRequest["web_message_uri"]);' +
              '}' +
            'break;' +
          '};' +
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

exports = module.exports = function (txn, res, params) {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');

  var wmr = { web_message_uri: txn.req.webMessageURI, web_message_target: txn.req.webMessageTarget };

  if (txn.req.webMessageURI) {
    var target = uri.parse(txn.req.webMessageURI);
    wmr.web_message_root = target.protocol + '//' + target.host;
  }

  return res.end(html.replace('{TARGET_ORIGIN}', txn.redirectURI).replace('{WEB_MESSAGE_REQUEST}', JSON.stringify(wmr)).replace('{RESPONSE}', JSON.stringify(params)));
}

exports.extensions = require('./request/extensions');
