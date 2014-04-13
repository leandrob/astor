var config = module.exports;

var fs = require('fs');
var path = require('path');

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var configFile = path.join(home, 'astor.config');

config.getIssueSession = function (name) {
	var config = (getConfig() || {}).issueSessions || {};

	return config[name];
}

config.setIssueSession = function (name, options) {
	var config = getConfig() || {};
	config.issueSessions = config.issueSessions || {};
	config.issueSessions[name] = options;
	setConfig(config);
}

config.getProfile = function (name) {
	var config = (getConfig() || {}).profiles || {};
	return config[name];
}

config.setProfile = function (name, profile) {
	var config = getConfig() || {};
	config.profiles = config.profiles || {};
	config.profiles[name] = profile
	setConfig(config);
}

config.getIssuer = function (name) {
	var config = (getConfig() || {}).issuers || {};
	return config[name];
}

config.setIssuer = function (name, issuer) {
	var config = getConfig() || {};
	config.issuers = config.issuers || {};
	config.issuers[name] = issuer;	
	setConfig(config);
}

function getConfig () {
	if (!fs.existsSync(configFile)) {
		return ;
	}

	var config = null;

	try {
		config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
	}
	catch (e) {
	}

	return config;
}

 function setConfig (config) {
    fs.writeFileSync(configFile, JSON.stringify(config, 0, 2), 'utf8');
}