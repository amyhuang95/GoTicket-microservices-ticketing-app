import { CustomError } from './custom-error';

/**
 * Class representing an error occurring during a database connection.
 */
export class DatabaseConnnectionError extends CustomError {
  statusCode = 500;

  /**
   * The reason for the database connection error.
   */
  reason = 'Error connecting to database';

  constructor() {
    super('Error connecting to DB');

    Object.setPrototypeOf(this, DatabaseConnnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
