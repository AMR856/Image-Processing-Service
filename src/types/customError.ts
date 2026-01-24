export default class CustomError extends Error {
  statusCode: number;
  isJoi?: boolean;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Restore prototype chain for `instanceof` to work
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
