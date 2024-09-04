import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// Custom error
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();

    // For extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // Process and return common error object
  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
    });
  }
}
