/*
 * Requirements:
 * (1) To be able to configure the pattern of the log/error messages.
 * (2) To be told the exact file/class/function that the log/error message came from.
 * (3) To be able to set separate log levels for separate files/classes/functions.
 * (4) To be able to use a different logger from the default console logger, as long as it implements ILogger.
 * (5) To minimize the work involved in creating new ILogger class:  just simple implementations for
 *      log, info, debug, and error--without explicitly checking the log configuration (e.g., not
 *      having to call isLogEnabled() within the new log() function).
 *
 *
 * DESIGN:
 *  Read log configuration
 *  Create slf4js singleton
 *
 *  slf4js.getLogger()
 *      If the a Logger type was specified in the configuration
 *          Create a new Logger of that type
 *      Otherwise
 *          Create a ConsoleLogger
 *      Pass the Logger instance to a new LoggingDecorator
 *      Return the LoggingDecorator
 */
'use strict';


module.exports = function(logger, logConfig, debugEnabled){

    const Decorator = require('./LoggingDecorator')(logConfig, debugEnabled);

    return {
        getLogger: function getLogger(that) {
            let name = (typeof that === 'string') ? that : (that.name || "");
            /*
             Definitions of the properties listed below:
             (1) subject:  the class, function, object, file, etc. being logged.
             (2) fileName:
             (3) logLevel: the minimum log level of the logger.
             (4) logEvent: the LogEvent object containing the event name (e.g., INFO),
             date/time of the event, and the location (e.g., the method
             containing the log statement.
             */
            let options = {
                subject: name,
                logLevel: null,
                logEvent: null
            };
            /*
             if (typeof window !== 'undefined' && logConfig.colorize){
             logConfig.pattern = '%c' + logConfig.pattern;
             } */
            return Object.freeze(new Decorator(logger, options));
        }
    }
};

