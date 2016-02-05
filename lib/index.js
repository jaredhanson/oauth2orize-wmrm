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
      'console.log("WMRM START");' +  // TODO: Remove this
      'var redirectURI = "{TARGET_ORIGIN}";' +
      'var webMessageRequest = {};' +
      'var authorizationResponse = {' +
        'type: "authorization_response",' +
        'response: {RESPONSE}' +
      '};' +
      'var mainWin = (window.opener != window) ? window.opener : window.parent;' +
      'if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {' +
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
  console.log('TODO: RESPOND USING WMRM...');
  
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');

  //console.log(txn);
  //console.log(params);

  return res.end(html.replace('{TARGET_ORIGIN}', txn.redirectURI).replace('{RESPONSE}', JSON.stringify(params)));
}
