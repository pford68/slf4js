/**
 * Created by philip on 5/30/15.
 */

// A default logger with default implementations so Loggers don't have to implement all of the methods.
module.exports = {
    log: function(varargs){
        console.log.apply(console, arguments);
    },
    info: function(varargs){
        console.log.apply(console, arguments);
    },
    error: function(varargs){
        console.log.apply(console, arguments);
    },
    debug: function(varargs){
        console.log.apply(console, arguments);
    },
    warn: function(varargs){
        console.log.apply(console, arguments);
    },
    trace: function(varargs){
        console.log.apply(console, arguments );
    },
    assert: function(varargs){
        console.log.apply(console, arguments );
    }
    // TODO:  support console.dir?
};
