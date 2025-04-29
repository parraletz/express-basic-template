# Logging System

This document explains how logging is implemented in the project using Pino, a very low overhead Node.js logger.

## Table of Contents

- [Introduction](#introduction)
- [Logging Structure](#logging-structure)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Log Levels](#log-levels)
- [Log Format](#log-format)
- [Error Logging](#error-logging)

## Introduction

The logging system is built on Pino, which provides:

- Extremely low overhead
- JSON logging by default
- Child loggers
- Pretty printing for development
- Transport support for log forwarding
- High performance

## Logging Structure

The logging system follows this structure:

```
src/
├── config/
│   └── logger.ts     # Logger configuration
├── middlewares/
│   └── logger.middleware.ts  # Request logging middleware
└── utils/
    └── logger.ts     # Logger utility functions
```

## Configuration

The logger is configured with the following settings:

```typescript
// src/config/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
})

// Create a child logger for HTTP requests
export const httpLogger = logger.child({ module: 'http' })
```

## Usage Examples

### Basic Logging

```typescript
import { logger } from '../config/logger'

// Info level logging
logger.info('Application started')

// Error level logging
logger.error({ err }, 'Failed to connect to database')

// Debug level logging
logger.debug({ requestId: req.id }, 'Processing request')

// Warning level logging
logger.warn({ resource: 'user', id: userId }, 'Resource not found')
```

### Request Logging Middleware

```typescript
// src/middlewares/logger.middleware.ts
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    httpLogger.info(
      {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      },
      'Request completed'
    )
  })

  next()
}
```

## Log Levels

The system uses the following log levels:

1. **fatal**: For critical errors that cause the application to terminate
2. **error**: For errors that need immediate attention
3. **warn**: For potentially harmful situations
4. **info**: For general operational information
5. **debug**: For detailed information useful for debugging
6. **trace**: For the most detailed information

## Log Format

Logs are formatted in JSON by default, with pretty printing in development:

```json
// Production log format
{"level":30,"time":1647784800000,"msg":"Request completed","method":"GET","url":"/api/users","status":200,"duration":"45ms"}

// Development log format (with pino-pretty)
[2024-03-20 10:30:00.000] INFO: Request completed
    method: "GET"
    url: "/api/users"
    status: 200
    duration: "45ms"
```

## Error Logging

Errors are logged with additional context:

```typescript
try {
  // Some operation
} catch (error) {
  logger.error(
    {
      err: error,
      context: {
        userId: req.user.id,
        operation: 'updateProfile'
      }
    },
    'Operation failed'
  )
}
```

## Best Practices

1. **Appropriate Log Levels**

   - Use `fatal` for critical errors that terminate the application
   - Use `error` for errors that need attention
   - Use `warn` for potentially problematic situations
   - Use `info` for normal operational events
   - Use `debug` for detailed debugging information
   - Use `trace` for the most detailed information

2. **Structured Logging**

   - Always include relevant context as the first argument
   - Use JSON format for machine parsing
   - Include request IDs for tracing
   - Add timestamps to all logs

3. **Performance Considerations**

   - Use child loggers for different modules
   - Avoid string interpolation in log messages
   - Use appropriate log levels in production
   - Consider log rotation and retention policies

4. **Error Handling**

   - Pass error objects directly to the logger
   - Include stack traces for debugging
   - Add relevant request/operation details
   - Consider error aggregation

5. **Security**
   - Never log sensitive data (passwords, tokens)
   - Sanitize user input in logs
   - Implement proper log access controls
   - Consider log encryption for sensitive environments

## Additional Resources

- [Pino Documentation](https://getpino.io/)
- [Node.js Logging Best Practices](https://www.loggly.com/blog/node-js-logging-best-practices/)
- [Pino vs Winston Comparison](https://blog.logrocket.com/pino-vs-winston-node-js-logging/)
