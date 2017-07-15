/**
 * LogEvent class
 */
'use strict';

module.exports = function LogEvent(context, caller, message) {

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
};
