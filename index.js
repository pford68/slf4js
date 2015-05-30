var notBrowser = typeof window === 'undefined';

require("ctx-loader");
var config = require("config"),
    debugEnabled = config.debug === true,
    logConfig = require("context!logProperties"),       // The log configuration
// For the client, this entire require() must be replaced with a facade that can be aliased.
    logger = logConfig.logger && notBrowser ?  require(logConfig.logger) : {},
    slf4js = require('./lib/slf4js')(logger, logConfig, debugEnabled);



module.exports = slf4js;


