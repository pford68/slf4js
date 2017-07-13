'use strict';

module.exports = function inject(logConfig) {
    logConfig = logConfig || {};
    const extend = require('object-util').extend;
    const colors = require('colors');
    const theme = extend(require('../conf/themes.json'), logConfig.theme || {});
    colors.setTheme(theme);

    const methodNames = [
        'log', 'error', 'warn', 'info', 'assert', 'debug'
    ];

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

    function wrap(name) {
        if (name !== 'debug') {
            ConsoleLogger.prototype[name] = function (...varargs) {
                let args = colorize(name, ...varargs);
                console[name](...args);
            }
        }
    }

    /**
     * A default logger with default implementations so Loggers don't have to implement all of the methods.
     * Sends messages to the console.
     *
     * @class
     * @implements {Logger}
     */
    function ConsoleLogger() {
    }

    ConsoleLogger.prototype.debug = function (...varargs) {
        let args = colorize('debug', ...varargs);
        console.log(...args);
    };
    methodNames.forEach(wrap);

    return new ConsoleLogger();
};
