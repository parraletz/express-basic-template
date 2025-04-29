import { createTerminus } from '@godaddy/terminus'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from './config'
import { logger } from './config/logger'
import { errorHandler } from './middlewares/error.middleware'
import { requestLogger } from './middlewares/logging.middleware'
import bookRoutes from './routes/book.routes'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Routes
app.use('/api/books', bookRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Error handling middleware
app.use(errorHandler)

// Terminus configuration
const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`)
})

createTerminus(server, {
  healthChecks: {
    '/health': async () => {
      return {
        status: 'ok',
        timestamp: Date.now()
      }
    }
  },
  onSignal: async () => {
    logger.info('Server is starting cleanup')
    return Promise.resolve()
  },
  onShutdown: async () => {
    logger.info('Cleanup finished, server is shutting down')
    return Promise.resolve()
  },
  timeout: 1000
})

export { app }
