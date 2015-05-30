/**
 * Created by philip on 5/25/15.
 */

var logConfig,
    debugEnabled = true,
    layoutCommands,                                     // Supported symbols and handlers
    LOG_LEVELS = Object.freeze({                        // Supported log levels
        FATAL: 1,
        ERROR: 2,
        WARN: 3,
        INFO: 4,
        DEBUG: 5,
        LOG: 6,
        TRACE: 7,
        ASSERT: 8
    }),
    LOG_STYLES = Object.freeze({                        // Supported log colors
        FATAL: "background:yellow:bold; color:red",
        ERROR: "color:red",
        WARN: "color:yellow",
        INFO: "color:green",
        DEBUG: "color:blue"
    }),
    _ = require("underscore"),
    ConsoleLogger = require("./ConsoleLogger"),
    defaultDateFormat = 'yyyy/MM/dd HH:mm:ss,SSS',
    dateFormat = require("dateformat");

//=======================================================================Functions
function justify(s, len){
    var str = [];
    len = parseInt(len);
    while(len-- > 0){
        str.push(" ");
    }
    str.push(s);
    return str.join("");
}



function LogEvent(context, caller, message) {
    this.name = caller.name;
    this.location = caller.caller ? caller.caller.name : context.callee.caller.name;
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
    var packages = name.split(".") || [],
        path = packages.concat([]),
        newName;
    for (var i = 0; i < packages.length; i++){
        path.pop();
        newName = logConfig[path.join(".")];
        if (newName) return newName;
    }
    return null;
}


function getLogLevel(logger) {
    if (!debugEnabled) return false;
    if (!logger.logLevel) {
        var level = -1, prop = findConfig(logger.subject);
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
            var num;
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
            var datePattern = format.match(this.value), v = this.value;
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
            var hits = format.match(this.value);
            if (!hits) return format;
            return format.replace(this.value, logger.fileName);
        }
    }
};


/*
 Replaces the original un-formatted log message with the formatted message.
 */
function fixArguments(that, args) {
    var logEvent = that.logger.logEvent;
    args = Array.prototype.slice.call(args);
    args.shift(); // Removing the original un-formatted log message from the argument list.

    // Prepending the newly formatted log message to the argument list.
    if (logEvent.data) {
        args = [that.format(), logEvent.data].concat(args);
    } else {
        args = [that.format()].concat(args);
    }
    return args;
}



/*
 If someone wants to use a different logger implementation, he/she need only provide the code
 he/she is interested in, and this decorator will wrap it within excise code.  That excise code
 checks the log configuration to determine whether the invoked Logger command is enabled for the
 Logger instance's class/function/module.  The excise code currently also injects the log event
 name, the date/time of the log event, and the name (if any) of the calling function, but those
 points may change.

 Note that I leave styling up to the ILogger implementations.  You can argue that the LoggingDecorator
 should remove that burden, in order to make implementing ILogger easier, but some log destinations
 will not support styles (text files, server consoles, alerts), and the implementations that
 use those destinations need to handle messages that contain style information.  The LoggingDecorator
 will be oblivious to the nature of the destination, unless the ILogger provides that information,
 which still gives the implementation one more thing to do.  Also, some destinations, like the
 browser console will handle style information automatically.

 On a separate point, we may or may not want to set styles for entire log levels, but we would
 still want to set them on a statement-by-statement basis as well.
 */
function LoggingDecorator(logger, options) {
    options = options || {};
    // NOTE:  Mixing into ConsoleLogger prevents implementations from having to implement all Logger methods.
    this.logger = _.extend({}, ConsoleLogger, logger, options);
}
LoggingDecorator.prototype = {
    log: function LOG(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.LOG) {
            logger.logEvent = new LogEvent(arguments, LOG, msg);
            logger.log.apply(logger, fixArguments(this, arguments));
        }
    },
    info: function INFO(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.INFO) {
            logger.logEvent = new LogEvent(arguments, INFO, msg);
            logger.info.apply(logger, fixArguments(this, arguments));
        }
    },
    error: function ERROR(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.ERROR) {
            logger.logEvent = new LogEvent(arguments, ERROR, msg);
            logger.error.apply(logger, fixArguments(this, arguments));
        }
    },
    debug: function DEBUG(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.DEBUG) {
            logger.logEvent = new LogEvent(arguments, DEBUG, msg);
            logger.debug.apply(logger, fixArguments(this, arguments));
        }
    },
    warn: function WARN(msg, varargs) {
        var logger = this.logger, logEvent, args;
        if (getLogLevel(logger) >= LOG_LEVELS.WARN) {
            logger.logEvent = new LogEvent(arguments, WARN, msg);
            logger.warn.apply(logger, fixArguments(this, arguments));
        }
    },
    /*
     Trace is not required by ILogger interface.
     */
    trace: function TRACE(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.TRACE && typeof logger.trace === 'function') {
            logger.logEvent = new LogEvent(arguments, TRACE, msg);
            logger.trace.apply(logger, fixArguments(this, arguments));
        }
    },
    /*
     Assert is not required by ILogger interface.
     */
    assert: function ASSERT(msg, varargs) {
        var logger = this.logger;
        if (getLogLevel(logger) >= LOG_LEVELS.ASSERT && typeof logger.assert === 'function') {
            logger.logEvent = new LogEvent(arguments, ASSERT, msg);
            logger.assert(this.format());
        }
    },
    dir: function DIR(that) {
        this.logger.dir(that);
    },
    /**
     *
     * @return {String}
     */
    format: function () {
        var format = logConfig.pattern,
            logger = this.logger;

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

module.exports = function($logConfig, $debugEnabled){
    logConfig = $logConfig;
    debugEnabled = $debugEnabled;
    return LoggingDecorator;
};