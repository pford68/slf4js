'use strict';

module.exports = function inject(logConfig) {

    const colorize = require('../LogUtils')(logConfig).colorize;
    const methodNames = [
        'log', 'error', 'warn', 'info', 'assert', 'debug'
    ];

    function wrap(name) {
        if (name !== 'debug') {
            BaseLogger.prototype[name] = function (...varargs) {
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
    function BaseLogger() {
    }

    BaseLogger.prototype.debug = function (...varargs) {
        let args = colorize('debug', ...varargs);
        console.log(...args);
    };
    methodNames.forEach(wrap);

    return new BaseLogger();
};
