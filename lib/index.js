var core = module.exports;
var config = require('./config');
var extend = require('util')._extend;

var jwt = require('jsonwebtoken');
var swt = require('simplewebtoken');

core.issue = function (req, cb) {
	var options = extend({}, req);

	if (typeof options.issuer == 'string') {
		var issuer = config.getIssuer(options.issuer);

		if (!issuer) {
			cb(new Error('Issuer with name "' + options.issuer + '" was not found on configuration.'));
			return;
		};

		options.issuer = issuer;
	}

	if (typeof options.profile == 'string') {
		var profile = config.getProfile(options.profile);

		if (!profile) {
			cb(new Error('Profile with name "' + options.profile + '" was not found on configuration.'));
			return;
		}

		options.profile = profile;
	};

	var supportedFormats = ['jwt', 'swt'];

	if (supportedFormats.indexOf(options.format.toLowerCase()) == -1) {
		cb(new Error('Unsuported token format.'));
		return
	}

	if (options.format == 'jwt') {
		var token = jwt.sign(extend({}, options.profile), options.issuer.privateKey, {
			expiresInMinutes: options.expiresOnMinutes,
			audience: options.audience,
			issuer: options.issuer.name
		});

		cb(null, token);
		return;
	};

console.log(options);
	var token = swt.sign(extend({}, options.profile), {
		key: options.issuer.privateKey,
		audience: options.audience,
		issuer: options.issuer.name,
		expiresInMinutes: options.expiresOnMinutes
	});

	cb(null, token);
}

// core.issue = function (options, cb) {

// 	var supportedFormats = ['jwt', 'swt'];

// 	if (supportedFormats.indexOf(options.format.toLowerCase()) == -1) {
// 		cb(new Error('Unsuported format.'));
// 		return
// 	}

// 	if (options.format == 'jwt') {
// 		var token = jwt.sign(options.claims, options.privateKey, {
// 			expiresInMinutes: options.expiresInMinutes,
// 			audience: options.audience,
// 			issuer: options.issuer
// 		});

// 		cb(null, token);
// 		return;
// 	};

// 	var token = swt.sign(options.claims, {
// 		key: options.privateKey,
// 		audience: options.audience,
// 		issuer: options.issuer,
// 		expiresInMinutes: options.expiresInMinutes
// 	});

// 	cb(null, token);
// }