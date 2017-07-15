/**
 *  Formats a message to fit the configured pattern.
 */
'use strict';

module.exports = function inject(logConfig) {

    const _ = require("underscore"),
        defaultDateFormat = 'yyyy/MM/dd HH:mm:ss,SSS',
        dateFormat = require("dateformat");


    function justify(s, len) {
        let str = [];
        len = parseInt(len);
        while (len-- > 0) {
            str.push(" ");
        }
        str.push(s);
        return str.join("");
    }

    /*
     Supported Layout symbols and their handlers.  Theoretically, we could let developers add handlers for symbols,
     or override existing ones, but that is not supported yet.  Supporting it, however, would be easy now.
     */
    const layoutCommands = {
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

    return {
        /**
         *
         * @return {String}
         */
        format: function(logger) {
            let format = logConfig.pattern;

            // Replacing each symbol found in the pattern with the corresponding log event values
            format = layoutCommands.JUSTIFY.execute(format, logger);
            /* JUSTIFY must come first, but the order
             of iteration below is not guaranteed,
             so I call it first. */
            _.each(layoutCommands, (cmd, key) => {
                if (key !== "JUSTIFY") {
                    format = cmd.execute(format, logger);
                }
            });
            return format;
        }
    };
};
