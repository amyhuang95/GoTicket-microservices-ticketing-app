import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define UserPayload properties
interface UserPayload {
  id: string;
  email: string;
}

// Reach existing type definition and make modification
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Middleware to extract the JWT payload and set it on 'req.currentUser'
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check whether the user has a JWT (check session object first)
  if (!req.session?.jwt) {
    return next();
  }

  // try to get the payload and set it on current user to be used by other middleware or route handler
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
