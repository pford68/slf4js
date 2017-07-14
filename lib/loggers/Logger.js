/**
 * Implemented by loggers
 *
 * @interface
 */
function Logger() {}


/**
 * For sending general logging information, usually messages that you do not want to see very often.
 * @param msg
 * @param varargs
 */
Logger.prototype.log = function(msg, ...varargs) {
    throw new Error('not implemented');
};


/**
 * Sends a warning message.
 * @param msg
 * @param varargs
 */
Logger.prototype.warn = function(msg, ...varargs){
    throw new Error('not implemented');
};


/**
 * Sends an error message.
 * @param msg
 * @param varargs
 */
Logger.prototype.error = function(msg, ...varargs){
    throw new Error('not implemented');
};


/**
 * Sends informative logging information.
 * @param msg
 * @param varargs
 */
Logger.prototype.info = function(msg, ...varargs){
    throw new Error('not implemented');
};


/**
 * Sends debugging information, one step up in importance from log().
 * @param msg
 * @param varargs
 */
Logger.prototype.debug = function(msg, ...varargs){
    throw new Error('not implemented');
};


/**
 * Sends a message and stack trace if first argument is false.
 * @param msg
 * @param varargs
 */
Logger.prototype.assert = function(msg, ...varargs){
    throw new Error('not implemented');
};


module.exports = Logger;

