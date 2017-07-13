/**
 * Utilities for the LoggingDecorator
 */
'use strict';

module.exports = function inject(logConfig, debugEnabled = true) {

    const LOG_LEVELS = require('./conf/LogLevels');
    const format = require('./LogFormatter')(logConfig).format;
    const extend = require('object-util').extend;
    const colors = require('colors');
    const theme = extend(require('./conf/themes.json'), logConfig.theme || {});
    colors.setTheme(theme);

    function colorize(name, ...varargs) {
        const colorize = colors[name.toUpperCase()];
        let args = [...varargs];
        return args.map(arg => {
            if (typeof arg === 'object') {
                return colorize(JSON.stringify(arg));
            } else {
                return colorize(arg);
            }
        });
    }


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
     Replaces the original un-formatted log message with the formatted message.
     */
    function fixArguments(logger, args) {
        const logEvent = logger.logEvent;
        args = [...args];

        // Prepending the newly formatted log message to the argument list.
        if (logEvent.data) {
            args = [format(logger), logEvent.data].concat(args);
        } else {
            args = [format(logger)].concat(args);
        }

        return args;
    }


    return {
        findConfig: findConfig,
        getLogLevel: getLogLevel,
        fixArguments: fixArguments,
        colorize: colorize
    };
};