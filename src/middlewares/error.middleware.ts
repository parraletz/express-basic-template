import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'
import { AppError } from '../utils/errors'

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

export const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next)
  }
}
