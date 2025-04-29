# Error Handling System

This document explains how error handling is implemented in the project, providing a consistent and robust way to handle errors across the application.

## Table of Contents

- [Introduction](#introduction)
- [Error Types](#error-types)
- [Error Structure](#error-structure)
- [Error Middleware](#error-middleware)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [HTTP Status Codes](#http-status-codes)

## Introduction

The error handling system is designed to:

- Provide consistent error responses
- Include detailed error information
- Support different types of errors
- Log errors appropriately
- Handle both expected and unexpected errors

## Error Types

The system defines several custom error classes:

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 'INTERNAL_SERVER_ERROR', 500)
    this.name = 'InternalServerError'
  }
}
```

## Error Structure

All errors follow a consistent structure in the response:

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details if available
  }
}
```

## Error Middleware

The error handling middleware processes all errors and formats the response:

```typescript
// src/middlewares/error.middleware.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    logger.warn('Application error:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    })
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.code,
      details: error.details
    })
  } else {
    logger.error('Unexpected error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    })
  }
}
```

## Usage Examples

### 1. Throwing Custom Errors

```typescript
// In a controller
if (!user) {
  throw new NotFoundError('User not found')
}

if (!isValidPassword) {
  throw new UnauthorizedError('Invalid credentials')
}

if (validationErrors.length > 0) {
  throw new ValidationError('Invalid input', validationErrors)
}
```

### 2. Handling Async Operations

```typescript
try {
  const result = await someAsyncOperation()
  return result
} catch (error) {
  if (error instanceof AppError) {
    throw error
  }
  throw new InternalServerError('Failed to complete operation')
}
```

### 3. Validation Error Example

```typescript
try {
  await validate(schema, data)
} catch (error) {
  if (error instanceof ZodError) {
    throw new ValidationError('Validation failed', error.errors)
  }
  throw error
}
```

## HTTP Status Codes

The system uses standard HTTP status codes:

- `400 Bad Request`: For validation errors
- `401 Unauthorized`: For authentication errors
- `403 Forbidden`: For authorization errors
- `404 Not Found`: For resource not found errors
- `409 Conflict`: For resource conflicts
- `422 Unprocessable Entity`: For semantic validation errors
- `500 Internal Server Error`: For unexpected errors

## Best Practices

1. **Use Appropriate Error Types**

   - Use specific error classes for different scenarios
   - Include relevant error codes
   - Provide meaningful error messages
   - Add context when available

2. **Error Logging**

   - Log all errors with appropriate level
   - Include relevant context in logs
   - Use structured logging format
   - Avoid logging sensitive information

3. **Error Handling in Async Code**

   - Always use try/catch blocks
   - Handle both expected and unexpected errors
   - Preserve error context
   - Use appropriate error types

4. **Client Communication**

   - Provide clear error messages
   - Include error codes for client handling
   - Add helpful details when available
   - Maintain consistent error format

5. **Security Considerations**
   - Don't expose sensitive information
   - Sanitize error messages
   - Use appropriate status codes
   - Log security-related errors

## Additional Resources

- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Error Handling Best Practices](https://www.rfc-editor.org/rfc/rfc7807)
