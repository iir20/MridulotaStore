import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mridulota-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateSessionToken(): Promise<string> {
  return randomUUID();
}

export function generateJWT(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJWT(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // First try JWT verification
    const jwtPayload = verifyJWT(token);
    if (jwtPayload) {
      const user = await storage.getUser(jwtPayload.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
        };
        return next();
      }
    }

    // Fallback to session-based authentication
    const session = await storage.getUserSession(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const session = await storage.getUserSession(token);
    if (session) {
      const user = await storage.getUser(session.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
        };
      }
    }
  } catch (error) {
    // Silently ignore authentication errors for optional auth
    console.log('Optional auth failed:', error);
  }

  next();
}