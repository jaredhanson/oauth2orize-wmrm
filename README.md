# oauth2orize-wmrm

[![Version](https://img.shields.io/npm/v/oauth2orize-wmrm.svg?label=version)](https://www.npmjs.com/package/oauth2orize-wmrm)
[![Build](https://img.shields.io/travis/jaredhanson/oauth2orize-wmrm.svg)](https://travis-ci.org/jaredhanson/oauth2orize-wmrm)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/oauth2orize-wmrm.svg?label=quality)](https://codeclimate.com/github/jaredhanson/oauth2orize-wmrm)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/oauth2orize-wmrm.svg)](https://coveralls.io/r/jaredhanson/oauth2orize-wmrm)
[![Dependencies](https://img.shields.io/david/jaredhanson/oauth2orize-wmrm.svg)](https://david-dm.org/jaredhanson/oauth2orize-wmrm)


[OAuth2orize](https://github.com/jaredhanson/oauth2orize) response mode plugin
providing support for [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00).

This response mode uses [HTML5 Web Messaging](https://www.w3.org/TR/webmessaging/)
instead of a redirect URI to return authorization responses from the
authorization server.

## Install

```bash
$ npm install oauth2orize-wmrm
```

## Usage

#### Parse Request Extensions

The web message response mode defines additional parameters needed in the
authorization request.  Register support for these extensions with a `Server`
instance in order to parse the parameters:

```js
server.grant(require('oauth2orize-wmrm').extensions());
```

#### Add Response Mode

For each grant in which web message response mode is desired, add support by
passing a `modes` option containing Web Message response mode.  For example,
using the token grant:

```js
server.grant({ 
  modes: {
    web_message: require('oauth2orize-wmrm')
  } }, 
  oauth2orize.grant.token(function(client, user, ares, done) {
    // TODO: issue token
  })
);
```

## Considerations

#### Specification

This module is implemented based on [OAuth 2.0 Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00),
draft version 00.  As a draft, the specification remains a work-in-progress and
is *not* final.  The specification is under discussion within the [OAuth Working Group](https://datatracker.ietf.org/wg/oauth/about/)
of the [IETF](https://www.ietf.org/).  Implementers are encouraged to track the
progress of this specification and update implementations as necessary.
Furthermore, the implications of relying on non-final specifications should be
understood prior to deployment.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016-2017 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>


