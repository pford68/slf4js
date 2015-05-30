/**
 *
 */
require("ctx-loader");
var config = require("config"),
    debugEnabled = config.debug === true,
    logConfig,
    logger,
    slf4js;

try {
    logConfig = require("context!logProperties");       // The log configuration
} catch(e) {
    logConfig = {
        logger: './lib/ConsoleLogger'
    };
}

logger = require(logConfig.logger);
slf4js = require('./lib/slf4js')(logger, logConfig, debugEnabled);


module.exports = slf4js;


