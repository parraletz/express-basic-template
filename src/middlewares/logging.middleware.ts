import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip
  })
  next()
}
