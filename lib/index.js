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
'</html>';

function jsonEscape(s) {
  if (typeof s !== 'string') { return s; }

  // This escaping prevents cross-site scripting (XSS) attacks.
  // <, >, and & are escaped so that JSON contents can be safely
  // embedded in HTML documents without confusing the parser.
  return s.replace(/</g, '\\u003C')
          .replace(/>/g, '\\u003E')
          .replace(/&/g, '\\u0026');
}

/**
 * Respond to authorization request using Web Message response mode.
 *
 * This module implements support for Web Message response mode.  This response
 * mode uses HTML5 Web Messaging instead of a redirect URI to return
 * authoriztion responses from the authorization server.
 *
 * Note that this response mode relies on a `webOrigin` being verified as part
 * of the transaction.  This is in contrast to typical OAuth reponse modes,
 * which rely on a `redirectURI`.  The difference is important, but subtle: a
 * web origin does not incorporate the path component of a URL, whereas a
 * URI does.  As such, delivering an access token via a response mode using a
 * web origin (such as Web Message) implies that *all* paths on that origin may
 * be able to receive the token.  Due to this, it is recommended that clients
 * explicitly register web origins distinct from redirect URIs.  Furthermore,
 * clients must not register web origins that host other clients which should be
 * prevented from receiving access tokens.
 *
 * The notion of a web origin, and its security implications, has never been
 * fully specified within OAuth.  A `js_origin_uri` parameter was defined by
 * [draft 07](http://openid.net/specs/openid-connect-registration-1_0-07.html)
 * of OpenID Connect Dynamic Client Registration 1.0, but was dropped from the
 * final specification for what remain unclear reasons (to me, at the time of
 * this writing).  Discussion on the topic can be found at:
 *   - http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20111121/001308.html
 *   - http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20111121/001317.html
 *   - http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20111121/001315.html
 *
 * The Web Message response mode bears some similarities with OAuth2 PostMessage
 * flow as implemented by Google.  Readers interested in tracking the evolution
 * of this flow, refer to:
 *   - https://github.com/princed/oauth2-postmessage-profile
 *   - http://www.riskcompletefailure.com/2013/03/postmessage-oauth-20.html
 *
 * Okta also has a postMessage variant, which is decribed here:
 *   - http://developer.okta.com/docs/api/resources/oauth2.html#postmessage-data-model
 *
 * Further information and sample code pertaining to Web Message response mode
 * can be found at:
 *   - http://www.slideshare.net/zigorou/oauth-20-web-messaging-response-mode-openid-summit-tokyo-2015
 *   - https://github.com/nov/oauth-wmrm-sample
 *
 * References:
 *  - [OAuth 2.0 Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00)
 *
 * @api public
 */
exports = module.exports = function (txn, res, params) {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');
  
  var to = txn.webOrigin;
  var wmr = jsonEscape(JSON.stringify({ web_message_uri: txn.req.webMessageURI, web_message_target: txn.req.webMessageTarget }));

  return res.end(html.replace('{TARGET_ORIGIN}', to).replace('{WEB_MESSAGE_REQUEST}', wmr).replace('{RESPONSE}', jsonEscape(JSON.stringify(params))));
}

exports.validate = function(txn) {
  if (!txn.webOrigin) { throw new Error('Unable to post message for OAuth 2.0 transaction'); }
};


exports.extensions = require('./request/extensions');
