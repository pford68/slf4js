/**
 * For browsers
 */

var config = require("../../config/client"),   // HACK
    debugEnabled = config.debug === true,
    logConfig = require("../../config/logProperties"),       // HACK
    slf4js = require('./lib/slf4js')(null, logConfig, debugEnabled);

module.exports = slf4js;
