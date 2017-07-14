'use strict';  // This clobbers what I am trying to do:  automate obtaining the context of the error.  :(


module.exports = function inject(logConfig, debugEnabled = true) {

    const LOG_LEVELS = require('./conf/LogLevels'),
        extend = require("underscore").extend,
        LogEvent = require('./LogEvent'),
        utils = require('./LogUtils')(logConfig, debugEnabled),
        getLogLevel = utils.getLogLevel,
        formatArguments = utils.formatArguments,
        format = require('./LogFormatter')(logConfig).format;


//=======================================================================Functions

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
                logger.log(formatArguments(logger, ...varargs));
            }
        },
        info: function INFO(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.INFO) {
                logger.logEvent = new LogEvent(varargs, INFO, msg);
                logger.info(formatArguments(logger, ...varargs));
            }
        },
        error: function ERROR(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.ERROR) {
                logger.logEvent = new LogEvent(varargs, ERROR, msg);
                logger.error(formatArguments(logger, ...varargs));
            }
        },
        debug: function DEBUG(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.DEBUG) {
                logger.logEvent = new LogEvent(varargs, DEBUG, msg);
                logger.debug(formatArguments(logger, ...varargs));
            }
        },
        warn: function WARN(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.WARN) {
                logger.logEvent = new LogEvent(varargs, WARN, msg);
                logger.warn(formatArguments(logger, ...varargs));
            }
        },
        /*
         Trace is not required by ILogger interface.
         */
        trace: function TRACE(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.TRACE && typeof logger.trace === 'function') {
                logger.logEvent = new LogEvent(varargs, TRACE, msg);
                logger.trace(formatArguments(logger, ...varargs));
            }
        },
        /*
         Assert is not required by ILogger interface.
         */
        assert: function ASSERT(msg, ...varargs) {
            const logger = this.logger;
            if (getLogLevel(logger) <= LOG_LEVELS.ASSERT && typeof logger.assert === 'function') {
                logger.logEvent = new LogEvent(varargs, ASSERT, msg);
                logger.assert(format(logger));
            }
        }
    };

    return LoggingDecorator;
};