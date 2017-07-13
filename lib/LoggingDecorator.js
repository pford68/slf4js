'use strict';  // This clobbers what I am trying to do:  automate obtaining the context of the error.  :(

let logConfig,
    debugEnabled = true,
    layoutCommands,                                     // Supported symbols and handlers
    LOG_LEVELS = Object.freeze({                        // Supported log levels
        FATAL:      1,
        ERROR:      2,
        WARN:       3,
        INFO:       4,
        DEBUG:      5,
        LOG:        6,
        TRACE:      7,
        ASSERT:     8
    }),
    LOG_STYLES = Object.freeze({                        // Supported log colors
        FATAL: "background:yellow:bold; color:red",
        ERROR: "color:red",
        WARN: "color:yellow",
        INFO: "color:green",
        DEBUG: "color:blue"
    }),
    _ = require("underscore"),
    defaultDateFormat = 'yyyy/MM/dd HH:mm:ss,SSS',
    dateFormat = require("dateformat");


//=======================================================================Functions
function justify(s, len){
    let str = [];
    len = parseInt(len);
    while(len-- > 0){
        str.push(" ");
    }
    str.push(s);
    return str.join("");
}



function LogEvent(context, caller, message) {
    this.name = caller.name;
    //this.location = caller.caller ? caller.caller.name : context.callee.caller.name;
    this.location = '';  // Damn you, strict mode!
    this.datetime = new Date();
    this.message = message;
    this.data = null;
    if (typeof message === 'string') {
        this.message = "";
        this.data = message;
    }

}

function findConfig(name){
    if (logConfig[name]) return logConfig[name];
    let packages = name.split(".") || [],
        path = packages.concat([]),
        newName;
    for (let i = 0; i < packages.length; i++){
        path.pop();
        newName = logConfig[path.join(".")];
        if (newName) return newName;
    }
    return null;
}


function getLogLevel(logger) {
    if (!debugEnabled) return false;
    if (!logger.logLevel) {
        let level = -1, prop = findConfig(logger.subject);
        if (prop) {
            level = LOG_LEVELS[prop.toUpperCase()] || -1;
        }
        logger.logLevel = level;
    }
    return logger.logLevel;
}

/*
 Supported Layout symbols and their handlers.  Theoretically, we could let developers add handlers for symbols,
 or override existing ones, but that is not supported yet.  Supporting it, however, would be easy now.
 */
layoutCommands = {
    JUSTIFY: {
        value: /%-[0-9]+/g,
        execute: function (format, logger) {
            let num;
            (format.match(this.value) || []).forEach(function (match) {
                num = match.replace("%-", "");
                format = format.replace("%-" + num, justify("", num));
            });
            return format;
        }
    },
    CLASSNAME: {
        value: /%M/g,
        execute: function (format, logger) {
            return format.replace(this.value, logger.subject);
        }
    },
    MESSAGE: {
        value: /%m/g,
        execute: function (format, logger) {
            return format.replace(this.value, logger.logEvent.message);
        }
    },
    LOCATION: {
        value: /%l/g,
        execute: function (format, logger) {
            return format.replace(this.value, logger.logEvent.location);
        }
    },
    EVENT: {
        value: /%p/g,
        execute: function (format, logger) {
            return format.replace(this.value, logger.logEvent.name);
        }
    },
    DATETIME: {
        value: /(%d\{[0-9A-Za-z/\-,\.:\s]+\})|%d/g,
        execute: function (format, logger) {
            let datePattern = format.match(this.value), v = this.value;
            if (datePattern) {
                datePattern.forEach(function (df) {
                    df = df.replace(/%d|\{|\}/g, "");
                    format = format.replace(v, dateFormat(logger.logEvent.datetime, (df || defaultDateFormat), true));
                });
            }
            return format;
        }
    },
    NEWLINE: {
        value: /%n/g,
        execute: function (format, logger) {
            return format.replace(this.value, "\n");
        }
    },
    FILENAME: {
        value: /%F/g,
        execute: function (format, logger) {
            let hits = format.match(this.value);
            if (!hits) return format;
            return format.replace(this.value, logger.fileName);
        }
    }
};


/*
 Replaces the original un-formatted log message with the formatted message.
 */
function fixArguments(that, args) {
    const logEvent = that.logger.logEvent;
    args = [...args];
    //args = Array.prototype.slice.call(args);
    //args.shift(); // Removing the original un-formatted log message from the argument list.

    // Prepending the newly formatted log message to the argument list.
    if (logEvent.data) {
        args = [that.format(), logEvent.data].concat(args);
    } else {
        args = [that.format()].concat(args);
    }

    return args;
}


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
    this.logger = _.extend({}, logger, options);
}
LoggingDecorator.prototype = {
    log: function LOG(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.LOG) {
            logger.logEvent = new LogEvent(varargs, LOG, msg);
            logger.log(...fixArguments(this, varargs));
        }
    },
    info: function INFO(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.INFO) {
            logger.logEvent = new LogEvent(varargs, INFO, msg);
            logger.info(...fixArguments(this, varargs));
        }
    },
    error: function ERROR(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.ERROR) {
            logger.logEvent = new LogEvent(varargs, ERROR, msg);
            logger.error(...fixArguments(this, varargs));
        }
    },
    debug: function DEBUG(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.DEBUG) {
            logger.logEvent = new LogEvent(varargs, DEBUG, msg);
            logger.debug(...fixArguments(this, varargs));
        }
    },
    warn: function WARN(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.WARN) {
            logger.logEvent = new LogEvent(varargs, WARN, msg);
            logger.warn(...fixArguments(this, varargs));
        }
    },
    /*
     Trace is not required by ILogger interface.
     */
    trace: function TRACE(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.TRACE && typeof logger.trace === 'function') {
            logger.logEvent = new LogEvent(varargs, TRACE, msg);
            logger.trace(...fixArguments(this, varargs));
        }
    },
    /*
     Assert is not required by ILogger interface.
     */
    assert: function ASSERT(msg, ...varargs) {
        const logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.ASSERT && typeof logger.assert === 'function') {
            logger.logEvent = new LogEvent(varargs, ASSERT, msg);
            logger.assert(this.format());
        }
    },
    /**
     *
     * @return {String}
     */
    format: function() {
        let format = logConfig.pattern;
        const logger = this.logger;

        // Replacing each symbol found in the pattern with the corresponding log event values
        format = layoutCommands.JUSTIFY.execute(format, this.logger);
        /* JUSTIFY must come first, but the order
         of iteration below is not guaranteed,
         so I call it first. */
        _.each(layoutCommands, function (cmd, key) {
            if (key !== "JUSTIFY") format = cmd.execute(format, logger);
        });
        return format;
    }
};

module.exports = function(config){
    logConfig = config;
    debugEnabled = true;
    return LoggingDecorator;
};