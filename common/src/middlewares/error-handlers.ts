import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

/**
 * Express middleware to handle errors thrown during request handling.
 *
 * @param err - The error object thrown.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the error details.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Checks if the error is an instance of `CustomError`
  if (err instanceof CustomError) {
    // If so, sends a formatted response with the appropriate status code and serialized errors.
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Otherwise, it sends a generic error response.
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
