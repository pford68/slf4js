'use strict';  // This clobbers what I am trying to do:  automate obtaining the context of the error.  :(


module.exports = function inject(logConfig) {

    let appenderPath;
    const LOG_LEVELS = require('./conf/LogLevels'),
        extend = require("underscore").extend,
        LogEvent = require('./LogEvent'),
        utils = require('./LogUtils')(logConfig),
        getLogLevel = utils.getLogLevel,
        toArray = utils.toArray,
        appenders = toArray(logConfig.appenders || 'ConsoleAppender').map( appender => {
            appenderPath = appender.startsWith('.') ? appender : `./appenders/${appender}`;
            return require(appenderPath)(logConfig);
        });


//======================================================================= Public

    /**
     * Decorates any logger, enhancing its functionality.
     *
     * @param logger
     * @param options
     * @constructor
     * @implements {Logger}
     */
    function LoggingDecorator(logger, options) {
        options = options || {};
        this.logger = extend({}, logger, options);
    }

    LoggingDecorator.prototype = {
        log: function LOG(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.LOG) {
                logger.logEvent = new LogEvent(varargs, LOG, msg);
                appenders.forEach( appender => {
                    logger.log(appender.append(logger, ...varargs));
                })
            }
        },
        info: function INFO(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.INFO) {
                logger.logEvent = new LogEvent(varargs, INFO, msg);
                appenders.forEach( appender => {
                    logger.info(appender.append(logger, ...varargs));
                })            }
        },
        error: function ERROR(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.ERROR) {
                logger.logEvent = new LogEvent(varargs, ERROR, msg);
                appenders.forEach( appender => {
                    logger.error(appender.append(logger, ...varargs));
                })
            }
        },
        debug: function DEBUG(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.DEBUG) {
                logger.logEvent = new LogEvent(varargs, DEBUG, msg);
                appenders.forEach( appender => {
                    logger.debug(appender.append(logger, ...varargs));
                })
            }
        },
        warn: function WARN(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.WARN) {
                logger.logEvent = new LogEvent(varargs, WARN, msg);
                appenders.forEach( appender => {
                    logger.warn(appender.append(logger, ...varargs));
                })
            }
        },
        /*
         Trace is not required by ILogger interface.
         */
        trace: function TRACE(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.TRACE && typeof logger.trace === 'function') {
                logger.logEvent = new LogEvent(varargs, TRACE, msg);
                appenders.forEach( appender => {
                    logger.trace(appender.append(logger, ...varargs));
                })
            }
        },
        /*
         Assert is not required by ILogger interface.
         */
        assert: function ASSERT(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.ASSERT && typeof logger.assert === 'function') {
                logger.logEvent = new LogEvent(varargs, ASSERT, msg);
                appenders.forEach( appender => {
                    logger.assert(appender.append(logger, ...varargs));
                })
            }
        }
    };

    return LoggingDecorator;
};