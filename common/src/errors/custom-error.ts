/**
 * Abstract class representing a custom error.
 * All custom errors should extend this class and implement the `statusCode` property
 * and `serializeErrors` method.
 */
export abstract class CustomError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  abstract statusCode: number;

  /**
   * Creates an instance of CustomError.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    // For extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Abstract method to serialize errors for consistent error formatting.
   * Must be implemented by subclasses.
   * @returns An array of objects containing error messages and optional fields.
   */
  abstract serializeErrors(): { message: string; field?: string }[];
}
