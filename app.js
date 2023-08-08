import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { xss } from 'express-xss-sanitizer'
import hpp from 'hpp'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import { AppError } from './utils/appError.js'
import errorController from './controllers/errorController.js'
import userRoutes from './routes/userRouter.js'
import eventRoutes from './routes/eventRoutes.js'
import compression from 'compression'
import cors from 'cors'

const app = express()
app.disable('x-powered-by')

// Parse JSON requests with a size limit
app.use(express.json({ limit: '10kb' }))

// Define a list of allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list or if it's undefined (e.g., same-origin requests)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

// Rate limiting middleware
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP'
})
app.use('/api', limiter)

// Security middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(cookieParser())

// compress
app.use(compression())
// Define your routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

// Handle undefined routes
app.all('*', (req, _res, next) => {
  next(new AppError(`Sorry, this URL: ${req.originalUrl} is not defined on this server`, 404))
})

// Error handling middleware
app.use(errorController)

export default app
