import { CustomError } from './custom-error';

export class DatabaseConnnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnnectionError.prototype);
  }

  // Serialize and return common error object
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
