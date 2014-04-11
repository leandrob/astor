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
	.description('Astor is a command line development tool for token-based authentication.');

program
	.command('issue [sessionName]')
	.description('Issues a token with the specified values.')
	.action(function(sessionName) {
		
		if (sessionName) {
			var options = config.getIssueSession(sessionName);

			if (!options) {
				showError('Session with name "' + sessionName + '" was not found.');
				return;
			}

			core.issue(options, function (err, token) {
				if (err) {
					showError('An error occurred trying to issue the token.', err);
					return;
				}

				console.log(token);
			});

			return;
		}

		getIssueOptions(function(options) {
			promptly.prompt('enter session name (empty for no save):', { default: '_default', retry: false }, function(err, name) {

				if (name != '_default') {
					config.setIssueSession('contoso', options);
				};

				core.issue(options, function (err, token) {
					if (err) {
						showError('An error occurred trying to issue the token.', err);
						return;
					}

					console.log(token);
				});
			});
		});

	});


program.parse(process.argv);

function showError(message, err) {
	console.log('Error: '.red + message);
	
	if (err) {
		console.log('Detail: '.magenta + err.message);
	};
}

function getIssueOptions(cb) {

	promptly.prompt('format (jwt):', { default: 'jwt'}, function(err, format) {
		
		var config = { format: format };
		promptly.prompt('issuer (http://localhost/):', { default: 'http://localhost' }, function(err, issuer) {
			
			config.issuer = issuer;
			promptly.prompt('audience (empty for no audience):', { default: '_default', retry: false }, function (err, aud) {
			
				if (aud != '_default') {
					config.audience = aud;
				}

				promptly.prompt('signing key:', null, function (err, key) {
				
					config.privateKey = key;
					promptly.prompt('expiration in minutes (60):', { default: 60 }, function (err, exp) {
						config.expiresInMinutes = exp;

						promptClaim(function(claims) {
							config.claims = claims;
							cb(config)							
						});
					});
				});
			});
		})
	});
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
