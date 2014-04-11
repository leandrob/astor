Astor
=============
Astor is a command line development tool for token-based authentication systems.

## Installation

```bash
$ npm install -g astor
```

## Usage

### Issue token

Astor allow you to issue a new token specifing paramters or loading an issue session from configuration.

```bash
$ astor issue [sessionName]
```

If `sessionName` is specified it will try to load session options from config.

## Supported Token Formats

Astor supports different token formats:

* [JSON Web Tokens (JWT)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html)
* [Simpe Web Tokens (SWT)](http://msdn.microsoft.com/en-us/library/windowsazure/hh781551.aspx)

## Next Steps

* Add token validate
* Add token request flows
* Add SAML token formats

## License

MIT




