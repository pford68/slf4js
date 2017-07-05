/**
 *
 */
const fs = require('fs');
const nconf = require('nconf');
nconf.argv().env([
    'logging',
    'logProperties'
]);
nconf.defaults({
    logger: './lib/ConsoleLogger',
    logging: {},
    logProperties: "./logProperties.json"  // This should work in the CWD.
});


if (fs.existsSync(nconf.get('logProperties'))){
    nconf.file({ file: nconf.get('logProperties') });
}

let logConfig = nconf.get();
//console.log(logConfig)
let logger = require(logConfig.logger);
module.exports = require('./lib/slf4js')(logger, logConfig.logging, logConfig.debug !== false);


