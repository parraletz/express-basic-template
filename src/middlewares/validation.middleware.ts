import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { logger } from '../config/logger'
import { AppError } from '../utils/errors'

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error:', error.errors)
        next(new AppError('Validation error', 'VALIDATION_ERROR', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}
