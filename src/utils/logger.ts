export class Logger {
  private static formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (data) {
      return `${logMessage} | Data: ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  static info(message: string, data?: any): void {
    console.log(this.formatMessage('info', message, data));
  }

  static warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  static error(message: string, error?: any): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage('error', message, errorData));
  }

  static debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}