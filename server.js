const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
// Security

const helmet = require('helmet')
const xss = require('x-xss-protection')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const mongoSanitize = require('mongo-sanitize')

// dev deps
const morgan = require('morgan')
// const colors = require('colors')
const middlewareLooger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

// Route file
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

// Load ENV VARS
dotenv.config({
  path: './config/config.env',
})

// connect to the data base
connectDB()

// init the app variable
const app = express()

// Body parser in order to read request body from the  req
// its basicly piesc of middleware
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

const passport = require('passport')
require('./passport') // must be before passport.use()

app.use(passport.initialize())

const auth = require('./routes/auth')

// Global sanitization middleware // Prevent NoSQL injection
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body)
  req.query = mongoSanitize(req.query)
  req.params = mongoSanitize(req.params)
  next()
})

// Set Security headears
app.use(helmet())

// Prevent XSS
app.use(xss())

// rate limitng requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

// // Apply the rate limiting middleware to all requests.
app.use(limiter)

// // prevent Hpp
app.use(hpp())

// // enable CORS
app.use(cors())

// Dev loging middleware
// runs onky on dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(morgan('dev'))
// file upload middleware
app.use(fileupload())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// // all miidleware functions have (req , res , next)
// const looger = (req, res, next) => {
//   // it have acces to to req
//   // we set value on the req object then we can access in any route that come after this midlleware

//   req.hello = 'hello looger' // we can access .hello in any route becuse we have app.use(looger) meaning the app insert the looger in the cycle
//   console.log('middleware ran')
//   // we call next so ot moves to the next piece of middlware in the cycle
//   next()
// }

// all miidleware functions have (req , res , next)

// app.use(middlewareLooger)
// mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth/', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

// to run the server we have to listen to ( http module )
// BASIC TESTING
app.get('/', (req, res) => {
  res.json({ succsess: true, message: 'Server Running al good' }).status(200)
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  // Call back
  const text =
    `listneng to port ${PORT}\nlistneng in mode ${process.env.NODE_ENV}`.bgWhite
      .green
  console.log(text)
})
