# oauth2orize-wmrm

[OAuth2orize](https://github.com/jaredhanson/oauth2orize) response mode plugin
providing support for [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00).

## Install

    $ npm install oauth2orize-wmrm

## Usage

## Considerations

#### Specification

This module is implemented based on [OAuth 2.0 Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00),
draft version 00.  As a draft, the specification remains a work-in-progress and
is *not* final.  The specification is under discussion within the [OAuth Working Group](https://datatracker.ietf.org/wg/oauth/about/)
of the [IETF](https://www.ietf.org/).  Implementers are encouraged to track the
progress of this specification and update implementations as necessary.
Furthermore, the implications of relying on non-final specifications should be
understood prior to deployment.

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016-2017 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
