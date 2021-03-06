/**
 * Utilities for the LoggingDecorator
 */
'use strict';

module.exports = function inject(logConfig) {

    const LOG_LEVELS = require('./conf/logLevels.json');
    const format = require('./LogFormatter')(logConfig).format;


    /**
     *
     * @param name
     * @returns {*}
     */
    function findConfig(name) {
        if (logConfig[name]) return logConfig[name];
        let packages = name.split(".") || [],
            path = packages.concat([]),
            newName;
        for (let i = 0; i < packages.length; i++) {
            path.pop();
            newName = logConfig[path.join(".")];
            if (newName) return newName;
        }
        return null;
    }


    /**
     * Returns the LogLevel configured for the current logger
     *
     * @param logger    the Logger instance
     * @returns {*}     the log level
     */
    function getLogLevel(logger) {
        if (!logger.logLevel) {
            let level = 100, prop = findConfig(logger.subject);
            if (prop) {
                level = LOG_LEVELS[prop.toUpperCase()] || -1;
            }
            logger.logLevel = level;
        }
        return logger.logLevel;
    }


    /**
     * Replaces the original un-formatted log message with the formatted message.
     *
     * @param logger
     * @param args
     * @returns {String}
     */
    function formatArguments(logger, ...args) {
        const logEvent = logger.logEvent;
        logEvent.data = logEvent.data || '';
        args = [...args];

        // Prepending the newly formatted log message to the argument list.
        // Stringifying any objects, then joining the array elements and
        // returning them as a String
        return ([format(logger), logEvent.data].concat(args)).map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            } else {
                return arg;
            }
        }).join('');
    }


    /**
     * Converts values that can be arrays or strings to arrays.
     *
     * @param value
     * @returns {*}
     */
    function toArray(value){
        if (Array.isArray(value)){
            return value;
        }
        return value.split(',').map( item => {
            return item.trim();
        });
    }


    //================================================================== Public
    return {
        findConfig: findConfig,
        getLogLevel: getLogLevel,
        formatArguments: formatArguments,
        toArray: toArray
    };
};