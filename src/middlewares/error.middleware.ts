import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', error)
  res.status(500).json({ error: 'Internal server error' })
}

export const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next)
  }
}
