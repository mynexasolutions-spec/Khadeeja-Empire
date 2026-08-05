export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
