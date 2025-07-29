import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ContextLogger } from '../observability/logger';
import { AppMetrics } from '../observability/metrics';

interface JWTPayload {
  sub: string; // Mudando de userId para sub (padrão JWT)
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      logger?: ContextLogger;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const logger = new ContextLogger({
    requestId: req.headers['x-request-id'] as string,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    operation: 'authentication',
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.authenticationFailed('unknown', 'Token não fornecido');
    AppMetrics.userLogin(false);
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.user = decoded;
    req.logger = new ContextLogger({
      requestId: req.headers['x-request-id'] as string,
      userId: decoded.sub,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    logger.userAuthenticated(decoded.sub);
    AppMetrics.userLogin(true);
    next();
  } catch {
    logger.authenticationFailed('unknown', 'Token inválido');
    AppMetrics.userLogin(false);
    AppMetrics.error('jwt_verification', 'authentication');
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
      req.user = decoded;
      req.logger = new ContextLogger({
        requestId: req.headers['x-request-id'] as string,
        userId: decoded.sub,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } catch {
      // Token inválido, mas não falha a requisição
      req.logger = new ContextLogger({
        requestId: req.headers['x-request-id'] as string,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }
  } else {
    req.logger = new ContextLogger({
      requestId: req.headers['x-request-id'] as string,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
  next();
};
