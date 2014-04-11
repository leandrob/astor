var config = module.exports;

var fs = require('fs');
var path = require('path');

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var configFile = path.join(home, 'astor.config');

config.getIssueSession = function (name) {
	var config = getConfig();

	if (!config || !config.issue || !config.issue[name]) {
		return;
	};

	return config.issue[name];
}

config.setIssueSession = function (name, options) {
	var config = getConfig() || { issue: {} };

	config.issue[name] = options;

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