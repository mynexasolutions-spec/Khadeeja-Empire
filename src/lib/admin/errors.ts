export type ProviderErrorCode =
  | "configuration"
  | "authorization"
  | "not_found"
  | "conflict"
  | "validation"
  | "storage"
  | "query"
  | "unknown";

export class DataProviderError extends Error {
  readonly code: ProviderErrorCode;

  constructor(code: ProviderErrorCode, message: string) {
    super(message);
    this.name = "DataProviderError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const ProviderError = DataProviderError;

export class ConfigurationError extends DataProviderError {
  constructor(message = "Data provider configuration is incomplete.") {
    super("configuration", message);
    this.name = "ConfigurationError";
  }
}

export class AuthorizationError extends DataProviderError {
  constructor(message = "You are not authorized to perform this operation.") {
    super("authorization", message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends DataProviderError {
  constructor(resource = "Record") {
    super("not_found", `${resource} was not found.`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DataProviderError {
  constructor(message = "That record already exists.") {
    super("conflict", message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends DataProviderError {
  constructor(message = "The supplied data is invalid.") {
    super("validation", message);
    this.name = "ValidationError";
  }
}

export function isDataProviderError(error: unknown): error is DataProviderError {
  return error instanceof DataProviderError;
}

export function toDataProviderError(
  error: unknown,
  fallback = "The data provider could not complete the operation."
): DataProviderError {
  if (isDataProviderError(error)) return error;
  return new DataProviderError("unknown", fallback);
}
