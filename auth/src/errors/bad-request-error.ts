import { CustomError } from './custom-error';

/**
 * Class representing a general error occurring when user provides invalid input.
 * Generates error message based on the input message.
 */
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
