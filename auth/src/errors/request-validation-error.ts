import { ValidationError } from 'express-validator';

// Custom error
export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // For extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
