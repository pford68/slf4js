'use strict';

module.exports = function inject(logConfig) {
    logConfig = logConfig || {};
    const extend = require('object-util').extend;
    const theme = extend(require('../conf/themes.json'), logConfig.theme || {});
    const methodNames = [
        'log', 'error', 'warn', 'info', 'assert', 'debug'
    ];

    /**
     * Logger that sends messages to the browser console.
     *
     * @class
     * @implements {Logger}
     */
    function BrowserAppender() {
    }

    methodNames.forEach(name => {
        BrowserAppender.prototype[name] = function (...varargs) {
            let args = ['%c%s', `color: ${theme[name]}`, ...varargs];
            console[name](...args);
        }
    });

    return BrowserAppender;
};

