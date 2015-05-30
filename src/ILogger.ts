/**
 * For type-checking Loggers with TypeScript
 */

interface ILogger {
    log(msg: string, ...varargs: any[]): void;
    info(msg: string, ...varargs: any[]): void;
    error(msg: string, ...varargs: any[]): void;
    debug(msg: string, ...varargs: any[]): void;
    warn(msg: string, ...varargs: any[]): void;
    trace(msg: string, ...varargs: any[]): void;
    assert(msg: string, ...varargs: any[]): void;
}

