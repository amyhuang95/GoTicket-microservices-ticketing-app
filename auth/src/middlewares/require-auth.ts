import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/**
 * Middleware to reject the request if the user is not logged in
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check whether user is logged in
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
