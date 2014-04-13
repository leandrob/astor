#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var colors = require('colors');
var promptly = require('promptly');

var config = require('../lib/config.js');
var core = require('../lib/index.js');

program
.version(require('../package.json').version)
.option('-f, --format [format]', 'Specify token format. Supported formats: jwt (default) and swt.', 'jwt')
.option('-i, --issuer [issuer]', 'Load [issuer] settings from configuration.')
.option('-n, --issuerName [issuerName]', 'Specify issuer name.')
.option('-l, --loadIssuerKey [file]', 'Specify issuer\'s key (public or private). Relative path to key file in PEM format.')
.option('-k, --issuerKey [key]', 'Specify issuer\'s key (public or private).')
.option('-a, --audience [audience]', 'Specify audience for the token.')
.option('-s, --session [sessionName]', 'Load a previous saved options with name [sessionName] for configuration.')
.option('-p, --profile [profile]', 'Load user profile with name [profile] from configuration.')
.option('-e, --expiration [expiration]', 'Specify expiration in minutes for the token. Default is 60 minutes.', 60)
.option('-o, --output [output]', 'Saves output into a file with name [output].')

.description('Astor is a command line development tool for token-based authentication.');

program
.command('issue')
.description('Issues a token with the specified options.')
.action(function() {

	if (program.session) {
		var options = config.getIssueSession(program.session);

		if (!options) {
			showError('Session with name "' + program.session + '" was not found on configuration.');
			return;
		};

		core.issue(options, function(err, token) {
			if (err) {
				showError('An error occurred trying to issue the token.', err);
				return;
			}

			showToken(token);
		});

		return;
	};

	var options = {
		format: program.format,
		audience: program.audience,
		expiresOnMinutes: program.expiration
	}

	try {
		options.issuer = getIssuer();
	}
	catch (e) {
		showError(e.message);
		return;
	}

	getProfile(program.profile, function(profile) {
		options.profile = profile;

		if (!profile) {
			showError('Profile with name "' + program.profile + '" was not found on configuration.');
			return;
		}

		core.issue(options, function(err, token) {
			if (err) {
				showError('An error occurred trying to issue the token.', err);
				return;
			}

			showToken(token);

			promptly.confirm('Would you like to save the session settings?', function (err, yes) {
				if (!yes) {
					return;
				}

				promptly.prompt('Enter session name:', function(err, name) {
					config.setIssueSession(name, options);
				})
			})
		})
	})
});

program
.command('add-issuer')
.description('Add a new issuer to configuration.')
.action(function() {

	if (!program.issuerName) {
		showError('Use -n argument to specify issuer name.');
		return;
	}

	if (!program.issuerKey && !program.loadIssuerKey) {
		showError('Use -k argument to specify issuer private key (Use -l for loading key from a file with PEM format)');
		return;
	};

	var issuer = null;

	try {
		issuer = getIssuer();
	}
	catch (e) {
		showError(e.message);
		return;
	}

	promptly.prompt('Enter a friendly name for the issuer (' + issuer.name + '):', { default: issuer.name }, function (err, name) {
		config.setIssuer(name, issuer);
	});
})

program.parse(process.argv);

function getProfile(profileName, cb) {
	if (profileName) {
		cb(profileName);
		return;
	}

	console.log('Create user profile...');
	printCommonClaimTypes();
	promptClaim(function(profile) {
		promptly.confirm('Would you like to save the profile?', function (err, yes) {
			if (!yes) {
				cb(profile);
				return;
			};

			promptly.prompt('Enter a name for saving the profile: ', function(err, name) {
				if (name != '_default') {
					config.setProfile(name, profile);
					cb(name);
					return;
				};

				cb(profile);
			})
		})

	});
}

function getIssuer() {
	if (program.issuer) {
		return program.issuer;
	}
	else if (program.issuerKey) {
		return { 
			name: program.issuerName,
			privateKey: program.issuerKey
		}
	}
	else if (program.loadIssuerKey) {
		if (!fs.existsSync(program.loadIssuerKey)) {
			throw new Error('Private key file "' + program.loadIssuerKey + '" was not found.');
		};

		return { 
			name: program.issuerName,
			privateKey: fs.readFileSync(program.loadIssuerKey).toString()
		}
	}

	throw new Error('Use -k or -l arguments to specify signing key or -i to load issuer settings from configuration.');
}

function showToken (token) {
	if (program.output) {
		fs.writeFileSync(program.output, token);
	} else {
		console.log(token.green);
	}
}

function showError(message, err) {
	console.log('Error: '.red + message);
	
	if (err) {
		console.log('Detail: '.magenta + err.message);
	};
}

function promptClaim(claims, cb) {

	if (typeof claims == 'function') {
		cb = claims;
		claims = {};
	};

	promptly.prompt('claim type (empty for finish):', { default: '_default' }, function (err, type) {
		if (type == '_default') {
			cb(claims);
			return;
		}

		promptly.prompt('claim value:', function (err, value) {
			claims[type] = value;

			promptClaim(claims, cb)
		});
	})
}

function printCommonClaimTypes() {
	console.log('Here you have some common claimtypes, just in case:'.magenta);
	
	console.log('- Name: '.cyan + 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
	console.log('- Email: '.cyan + 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email');
	console.log('- Name Identifier: '.cyan + 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier');
	console.log('- User Principal: '.cyan + 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn');
	console.log('');
}
