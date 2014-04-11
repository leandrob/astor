var core = module.exports;

var jwt = require('jsonwebtoken');
var swt = require('simplewebtoken');

core.issue = function (options, cb) {

	var supportedFormats = ['jwt', 'swt'];

	if (supportedFormats.indexOf(options.format.toLowerCase()) == -1) {
		cb(new Error('Unsuported format.'));
		return
	}

	if (options.format == 'jwt') {
		var token = jwt.sign(options.claims, options.privateKey, {
			expiresInMinutes: options.expiresInMinutes,
			audience: options.audience,
			issuer: options.issuer
		});

		cb(null, token);
		return;
	};

	var token = swt.sign(options.claims, {
		key: options.privateKey,
		audience: options.audience,
		issuer: options.issuer,
		expiresInMinutes: options.expiresInMinutes
	});

	cb(null, token);
}