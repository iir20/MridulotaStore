import { Request, Response, NextFunction } from 'express';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (context) {
      return `${baseMessage} ${JSON.stringify(context, null, this.isDevelopment ? 2 : 0)}`;
    }
    
    return baseMessage;
  }

  error(message: string, context?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, context));
  }

  warn(message: string, context?: any) {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: any) {
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: any) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  // HTTP request logging middleware
  requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const { method, url, ip } = req;
      
      // Log request
      this.info(`${method} ${url}`, { 
        ip, 
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });

      // Override res.end to log response
      const originalEnd = res.end;
      res.end = function(chunk?: any, encoding?: any, cb?: any) {
        const duration = Date.now() - startTime;
        const { statusCode } = res;
        
        logger.info(`${method} ${url} ${statusCode}`, {
          duration: `${duration}ms`,
          size: res.get('Content-Length') || 0,
          ip
        });

        originalEnd.call(this, chunk, encoding, cb);
      };

      next();
    };
  }

  // Error logging middleware
  errorHandler() {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
      const { method, url, ip } = req;
      const userId = (req as any).user?.id;
      
      this.error('Request failed', {
        method,
        url,
        ip,
        userId,
        error: {
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
          name: error.name
        },
        body: req.body,
        params: req.params,
        query: req.query
      });

      // Don't expose internal errors in production
      const message = this.isDevelopment ? error.message : 'Internal server error';
      const status = error.status || error.statusCode || 500;
      
      res.status(status).json({
        error: true,
        message,
        ...(this.isDevelopment && { stack: error.stack })
      });
    };
  }

  // Performance monitoring
  performanceLogger(operationName: string) {
    return {
      start: () => {
        const startTime = process.hrtime.bigint();
        return {
          end: (context?: any) => {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
            
            this.info(`Performance: ${operationName}`, {
              duration: `${duration.toFixed(2)}ms`,
              ...context
            });
          }
        };
      }
    };
  }

  // Security event logging
  securityEvent(event: string, context?: any) {
    this.warn(`Security Event: ${event}`, {
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  // Business logic logging
  businessEvent(event: string, context?: any) {
    this.info(`Business Event: ${event}`, {
      timestamp: new Date().toISOString(),
      ...context
    });
  }
}

export const logger = new Logger();

// Security events helper
export const logSecurityEvent = (event: string, req: Request, context?: any) => {
  logger.securityEvent(event, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    url: req.url,
    method: req.method,
    ...context
  });
};

// Business events helper
export const logBusinessEvent = (event: string, context?: any) => {
  logger.businessEvent(event, context);
};