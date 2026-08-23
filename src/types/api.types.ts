// ============================================================
// API TYPES
// ============================================================
import type { AxiosError } from 'axios';

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed. Please check your connection.') {
    super('NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Your session has expired. Please log in again.') {
    super('UNAUTHENTICATED', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You don't have permission to perform this action.") {
    super('UNAUTHORIZED', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]> = {}
  ) {
    super('VALIDATION_ERROR', message, 422, fieldErrors);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.') {
    super('NOT_FOUND', message, 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'An unexpected server error occurred. Please try again later.') {
    super('SERVER_ERROR', message, 500);
    this.name = 'ServerError';
  }
}

export function transformApiError(error: AxiosError<{ message: string; code: string; errors?: Record<string, string[]> }>): AppError {
  const { response } = error;
  if (!response) return new NetworkError();

  const { status, data } = response;

  switch (status) {
    case 400: return new ValidationError(data?.message ?? 'Invalid request', data?.errors);
    case 401: return new AuthenticationError(data?.message);
    case 403: return new AuthorizationError(data?.message);
    case 404: return new NotFoundError(data?.message);
    case 422: return new ValidationError(data?.message ?? 'Validation failed', data?.errors);
    case 429: return new AppError('RATE_LIMITED', 'Too many requests. Please slow down.', 429);
    case 500:
    case 502:
    case 503: return new ServerError(data?.message);
    default:  return new AppError('UNKNOWN_ERROR', data?.message ?? 'An unknown error occurred', status);
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
