
## A Simple Facade for JavaScript loggers.

![Build Status](https://travis-ci.org/pford68/slf4js.svg?branch=master)
[![npm version](https://badge.fury.io/js/slf4js.svg)](https://badge.fury.io/js/slf4js)

I have used versions of this logger in many of my projects, both on the client (with Browserify) in angularjs
projects and in Node modules and applications.

slf4js wraps specific logger implementations with a standard logger interface.  The job of performing the 
logging is delegated to the specific logging implementations, slf4js mostly provides the interface and 
coerces the logger implementations to behave more like loggers such as log4j. which I like.  
In this way, you can swap out loggers easily, which you can't do if you sprinkle code for a specific logger 
implementation throughout your code.

To configure log messages, simply create a JSON object containing the format for the log messages, 
and the log levels for whatever you want to log.  Log levels can be assigned to anything--files, "classes," functions, "packages."
To use a custom logger, assign the path to logger file to the optional "logger" property.
If you omit the logger property, the default ConsoleLogger will be used, sending messages to the browser console.

 
#### An example configuration file:
```json
 {
    "logger": "logging/AlertLogger",
    "pattern": "%d{yyyy/MM/dd HH:mm:ss.SSS} [%M] %p%-5l - %m%n",
    "firstModule": "INFO",                     
    "MyGreatClass": "LOG"                      
 }
``` 
* "firstModule" is a function being logged from INFO up.
* "MyGreatClass" is a "class" being logged from LOG up.
</p>
 
## Configuration properties:
* pattern:  The format for log messages
* logger:  [optional] A String path to the Logger implementation class to use for logger. 
* All other properties are key-value pairs mapping a string (which can be the name of a function, the "name"
       of a class, or any string that was used when the logger instance was created) to a log level.  Hence,
       given the properties example above, slf4js.getLogger("MyGreatClass") would create a Logger with a
       log level of LOG, because "MyGreatClass" maps to LOG.


### Pattern Symbols
The pattern symbols are the same ones used by log4j, and for the most part they have the same functions,
but there are a few differences, and only the symbols below are supported:

% The CSS style for the log message.  This departs from log4j and follows the Console API.


%d{<i>date format</i>}
The date of the event.  Optionally the date format follows within braces:
e.g., %d{yyyy/MM/dd HH:mm:ss,SSS}.  If the format is omitted, the format defaults to yyyy/MM/dd HH:mm:ss.

| Pattern  | Description |
| -------- | --------------
| %F       | The web page where the log request was issued. |
| %l       | The function that generated the event |
| %L       | |
| %m       | The log message |
| %M       | Class, function, file, package that issued the message.  The name will be the one passed to slf4js.getLogger() when the logger was created. |
| %n       | The platform-specific newline character |
| %p       | The log level of the event |
| %%       | The percent sign |
| %-[0-9]+ | Moves the next part of the message to the right by the specified number of spaces:  <br />e.g., %p%-5l, writes the log level, followed by 5 spaces followed by the location. |

