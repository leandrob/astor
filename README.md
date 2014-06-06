Astor
=============
Astor is a command line development tool for token-based authentication systems. It allows you to issue JWT and SWT for testing and development. You can also store settings like issuers and user profile to easly combine them:

```bash
$ astor issue -issuer myissuer -profile me@leandrob.com -audience http://relyingparty.com/

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lI
joiTGVhbkIiLCJhdWQiOiJodHRwOi8vcmVseWluZ3BhcnR5LmNvbS8iLCJpc3MiOiJodHRwOi8vbXlpc3N1ZXIuY29tLyIsImlhdCI6MTM5NzM3NjU5MX0
.d6Cb0IQsltocjOtLsfXhjseLcZpcNIWnHeIv4bqrCv4

```

You can even store this combinations of issuer, profile, audience and other options with a friendly name to reuse on the future:

```bash
$ astor issue -s myCombinationName

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lI
joiTGVhbkIiLCJhdWQiOiJodHRwOi8vcmVseWluZ3BhcnR5LmNvbS8iLCJpc3MiOiJodHRwOi8vbXlpc3N1ZXIuY29tLyIsImlhdCI6MTM5NzM3NjU5MX0
.d6Cb0IQsltocjOtLsfXhjseLcZpcNIWnHeIv4bqrCv4
```


# Installation

```bash
$ npm install -g astor
```

# Usage

```bash
$ astor --help

  Usage: astor [options] [command]

  Commands:

    issue                  Issues a token with the specified options.
    add-issuer             Add a new issuer to configuration.

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -f, --format [format]          Specify token format. Supported formats: jwt (default) and swt.
    -i, --issuer [issuer]          Load [issuer] settings from configuration.
    -n, --issuerName [issuerName]  Specify issuer name.
    -l, --loadIssuerKey [file]     Specify issuer\'s key (public or private). Relative path to key file in PEM format.
    -k, --issuerKey [key]          Specify issuer\'s key (public or private).
    -a, --audience [audience]      Specify audience for the token.
    -s, --session [sessionName]    Load a previous saved options with name [sessionName] for configuration.
    -p, --profile [profile]        Load user profile with name [profile] from configuration.
    -e, --expiration [expiration]  Specify expiration in minutes for the token. Default is 60 minutes.
    -o, --output [output]          Saves output into a file with name [output].
```

## Commands

### issue

`astor issue` command allows you to issue tokens. You can specifiy all information required to issue the token using arguments or load options from configuration.

```bash
$ astor issue -issuer myissuer -profile me@leandrob.com -audience http://relyingparty.com/
```

**Basic Options:**

* `-f, --format [format]` (optional) Specifies token format. Supported formats are jwt and swt. If not specified it will use jwt as default.
* `-n, --issuerName [issuerName]` (optional) Specifies issuer name if not loaded from configuration.
* `-k, --issuerKey [key]` (optional) Specifies issuer key (string) if not loaded from configuration.
* `-l, --loadIssuerKey [file]` (optional) Specifies issuer key file if not loaded from configuration.
* `-a, --audience [audienceUri]` (optional) Specifies audience for the token, if not specified token will not have audience.
* `-e, --expiration [expiration]` (optional) Specifies expiration in minutes for the token. Default is 60 minutes.
* `-o, --output [output]` (optional) Saves output into a file with name [output].


**Load from config options:**

* `-i, --issuer [issuerName]` (optional) Load issuer settings (name and privateKey) from configuration. 
* `-p, --profile [profile]` (optional) Load user profile from configuration.
* `-s, --session [session]` (optional) Load the whole options: token format, issuer, user profile, audience and expiration, from configuration.


####Issue a JWT specifing issuer name, issuer key file and audience.

```bash
$ astor issue -n http://myissuer.com/ -l privateKey.key -a http://relyingparty.com/

Create user profile...
Here you have some common claimtypes, just in case:
- Name: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
- Email: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email
- Name Identifier: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
- User Principal: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn

claim type (empty for finish): http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
claim value: LeanB
claim type (empty for finish): http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email
claim value: me@leandrob.com

Would you like to save the profile? yes
Enter a name for saving the profile: me@leandrob.com

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi
TGVhbkIiLCJhdWQiOiJodHRwOi8vcmVseWluZ3BhcnR5LmNvbS8iLCJpc3MiOiJodHRwOi8vbXlpc3N1ZXIuY29tLyIsImlhdCI6MTM5NzM3NjU5MX0.
d6Cb0IQsltocjOtLsfXhjseLcZpcNIWnHeIv4bqrCv4

Would you like to save the session settings? yes
Enter session name: myissuer-jwt-leanb
```

####Issue a JWT, loading user profile from configuration.

If you don't use `-p` argument you will be prompt for creating user profile, you will also have the option of saving the profile in configuration for the future. In the previous example I'm saving user profile as `me@leandrob.com` so next time I don't need to enter claim types and claim values manualy:

```bash
$ astor issue -n http://myissuer.com/ -l privateKey.key -p me@leandrob.com -a http://relyingparty.com/

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi
TGVhbkIiLCJhdWQiOiJodHRwOi8vcmVseWluZ3BhcnR5LmNvbS8iLCJpc3MiOiJodHRwOi8vbXlpc3N1ZXIuY29tLyIsImlhdCI6MTM5NzM3NjU5MX0.
d6Cb0IQsltocjOtLsfXhjseLcZpcNIWnHeIv4bqrCv4

Would you like to save the session settings? yes
Enter session name: myissuer-me@leandrob.com
```
You can also load issuer settings (name and privateKey) from configuration (use `add-issuer` command to save issuer configuration first):

**Issue a JWT, loading issuer and user profile from configuration.**

```bash
$ astor issue -i myissuer -p me@leandrob.com -a http://relyingparty.com/ 

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi
TGVhbkIiLCJhdWQiOiJodHRwOi8vcmVseWluZ3BhcnR5LmNvbS8iLCJpc3MiOiJodHRwOi8vbXlpc3N1ZXIuY29tLyIsImlhdCI6MTM5NzM3NjU5MX0.
d6Cb0IQsltocjOtLsfXhjseLcZpcNIWnHeIv4bqrCv4

Would you like to save the session settings? yes
Enter session name: myissuer-me@leandrob.com
```

####Issue a JWT, loading the whole settings from configuration

After each `issue` session you will be prompt for saving the session settings for the future, this will allow you to use the `-s` argument to load the whole settings next time:

```bash
$ astor issue -s myissuer-me@leandrob.com
```

### add-issuer

`astor add-issuer` command allows you to store issuer information (name and private key) in configuration to use in future `issue` sessions using the `-i` argument.

```bash
$ astor add-issuer -n http://myissuer.com/ -k MIICDzCCAXygAwIBAgIQVWXAvbbQyI5BcFe0ssmeKTAJBg=
Enter a friendly name for the issuer (http://myissuer.com/): myissuer
```

**Options:**

* `-n, --issuerName [issuerName]` (optional) Specifies issuer name if not loaded from configuration.
* `-k, --issuerKey [key]` (optional) Specifies issuer key (string) if not loaded from configuration.
* `-l, --loadIssuerKey [file]` (optional) Specifies issuer key file if not loaded from configuration.

####Add Issuer with key file

```bash
$ astor add-issuer -n http://myissuer.com/ -l privateKey.pem
Enter a friendly name for the issuer (http://myissuer.com/): myissuer
```
####Use added issuer on a issue session

```bash
$ astor issue -i myissuer -p me@leandrob.com -a http://relyingparty.com/ 
```

# Hack it!

Astor saves configuration in `astor.config` file, you will find the file in your home directory so you can add, remove or modify user profiles, issuers, and issue sessions very easy!

```javascript
{
  "profiles": {
    "me@leandrob.com": {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "Leandro Boffi",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email": "me@leandrob.com"
    },
    "john@smith.com": {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "John Smith",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email": "John Smith",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role": "Sales Manager",
    }
  },
  "issuers": {
    "contoso": {
      "name": "contoso",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAwST\n-----END RSA PRIVATE KEY-----\n"
    },
    "myissuer": {
      "name": "http://myissuer.com/",
      "privateKey": "MIICDzCCAXygAwIBAgIQVWXAvbbQyI5BcFe0ssmeKTAJBg="
    }
  }
}
```

# Supported Token Formats

Astor supports different token formats:

* [JSON Web Tokens (JWT)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html)
* [Simpe Web Tokens (SWT)](http://msdn.microsoft.com/en-us/library/windowsazure/hh781551.aspx)

# Next Steps

* Add token validate
* Add token request flows
* Add SAML token formats

# License

MIT




