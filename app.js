import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { xss } from 'express-xss-sanitizer'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import { AppError } from './utils/appError.js'
import errorController from './controllers/errorController.js'
import userRoutes from './routes/userRouter.js'
import eventRoutes from './routes/eventRoutes.js'
import bodyParser from 'body-parser'

const app = express()

// body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// security middleware
express.json({ limit: '10kb' })
// limit request
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP'
})
app.use('/api', limiter)
// set security http
app.use(helmet())
// data sanitization against NoSql query injection

// data sanitization against XSS
app.use(xss())
// parameter pollution
app.use(hpp())
app.use(cookieParser())

// routes

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `sorry this url: ${req.originalUrl} is no define on this server`,
      404
    )
  )
})

app.use(errorController)

export default app
