import winston from 'winston';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';

// Extensão do tipo Request para incluir propriedades customizadas
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      logger?: ContextLogger;
    }
  }
}

// Formato personalizado para logs estruturados
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const logObject = {
      timestamp,
      level,
      message,
      service: 'shortener-api',
      environment: env.NODE_ENV,
      ...meta,
    };
    return JSON.stringify(logObject);
  }),
);

// Criação do logger principal
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: {
    service: 'shortener-api',
    version: process.env.npm_package_version || '1.0.0',
  },
  transports: [
    // Console transport para desenvolvimento
    new winston.transports.Console({
      format:
        env.NODE_ENV === 'development'
          ? winston.format.combine(winston.format.colorize(), winston.format.simple())
          : logFormat,
    }),

    // File transports apenas para desenvolvimento local
    ...(env.NODE_ENV === 'development' && !process.env.VERCEL
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 10,
          }),
        ]
      : []),
  ],
});

// Interface para contexto de log estruturado
export interface LogContext {
  userId?: string;
  requestId?: string;
  shortCode?: string;
  originalUrl?: string;
  ipAddress?: string;
  userAgent?: string;
  operation?: string;
  duration?: number;
  error?: Error | string;
  email?: string;
  reason?: string;
  method?: string;
  path?: string;
  statusCode?: number;
}

// Logger com contexto
export class ContextLogger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private log(level: string, message: string, additionalContext: LogContext = {}) {
    const fullContext = { ...this.context, ...additionalContext };
    logger.log(level, message, fullContext);
  }

  info(message: string, context: LogContext = {}) {
    this.log('info', message, context);
  }

  warn(message: string, context: LogContext = {}) {
    this.log('warn', message, context);
  }

  error(message: string, context: LogContext = {}) {
    this.log('error', message, context);
  }

  debug(message: string, context: LogContext = {}) {
    this.log('debug', message, context);
  }

  // Métodos específicos para eventos de negócio
  urlCreated(shortCode: string, originalUrl: string, userId?: string) {
    this.info('URL created successfully', {
      operation: 'url_creation',
      shortCode,
      originalUrl,
      userId,
    });
  }

  urlAccessed(shortCode: string, originalUrl: string, ipAddress: string) {
    this.info('URL accessed', {
      operation: 'url_access',
      shortCode,
      originalUrl,
      ipAddress,
    });
  }

  userAuthenticated(userId: string) {
    this.info('User authenticated successfully', {
      operation: 'user_authentication',
      userId,
    });
  }

  authenticationFailed(email: string, reason: string) {
    this.warn('Authentication failed', {
      operation: 'authentication_failure',
      email,
      reason,
    });
  }

  operationTimed(operation: string, duration: number, context: LogContext = {}) {
    this.info('Operation completed', {
      operation,
      duration,
      ...context,
    });
  }
}

// Middleware para logging de requisições HTTP
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  req.requestId = requestId;
  req.logger = new ContextLogger({
    requestId,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    req.logger?.info('HTTP Request completed', {
      operation: 'http_request',
      method: req.method,
      path: req.path,
      statusCode,
      duration,
      userId: req.user?.sub,
    });
  });
  next();
};
