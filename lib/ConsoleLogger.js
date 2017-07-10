/**
 * Created by philip on 5/30/15.
 */
'use strict';

// A default logger with default implementations so Loggers don't have to implement all of the methods.
function ConsoleLogger(){}
ConsoleLogger.prototype = console;
ConsoleLogger.prototype.debug = function(...varargs){
    console.log(...varargs);
};

module.exports = new ConsoleLogger();
