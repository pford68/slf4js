/**
 *
 */
const Logger = require('../../lib/loggers/Logger');

function TestLogger(){
    this.messages = [];
}
TestLogger.prototype.lastMessage = function(){
    return this.messages[this.messages.length - 1];
};
TestLogger.prototype.add = function(msg){
    return this.messages.push(msg)
};
Object.keys(Logger.prototype).forEach( name => {
    if (Logger.prototype.hasOwnProperty(name)){
        TestLogger.prototype[name] = function(msg, ...varargs){
            this.add({
                name: name,
                data: msg,
                args: [...varargs]
            })
        };
    }
});

module.exports = TestLogger;
