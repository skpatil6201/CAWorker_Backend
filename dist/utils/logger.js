"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        if (data) {
            return `${logMessage} | Data: ${JSON.stringify(data)}`;
        }
        return logMessage;
    }
    static info(message, data) {
        console.log(this.formatMessage('info', message, data));
    }
    static warn(message, data) {
        console.warn(this.formatMessage('warn', message, data));
    }
    static error(message, error) {
        const errorData = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error;
        console.error(this.formatMessage('error', message, errorData));
    }
    static debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, data));
        }
    }
}
exports.Logger = Logger;
