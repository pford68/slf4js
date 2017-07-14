/**
 *
 */
const fs = require('fs');
const defaults = {
    logger: './lib/loggers/BaseLogger',
    appenders: 'BrowserConsoleAppender'
};
const extend = require('object-util').extend;
let logConfig = {};

if (fs.existsSync('./logProperties.json')){  // This should be in the CWD.
   extend(logConfig, defaults, require('./logProperties.json'));
}

let logger = require(logConfig.logger)(logConfig);
module.exports = require('./lib/slf4js')(logger, logConfig);
