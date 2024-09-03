export class DatabaseConnnectionError extends Error {
  reason = 'Error connecting to database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnnectionError.prototype);
  }
}
