'use strict';

module.exports = function inject() {

    const methodNames = [
        'log', 'error', 'warn', 'info', 'assert', 'debug'
    ];

    function wrap(name) {
        if (name !== 'debug') {
            BaseLogger.prototype[name] = function (...varargs) {
                console[name](...varargs);
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
        console.log(...varargs);
    };
    methodNames.forEach(wrap);

    return new BaseLogger();
};
