import { CustomError } from './custom-error';

/**
 * Class representing an error occurring when user visits a page that does not exist.
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
