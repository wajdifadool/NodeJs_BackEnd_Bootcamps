const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
// dev deps
const morgan = require('morgan')
const colors = require('colors')
const middlewareLooger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

// Route file
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

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

// Dev loging middleware
// runs onky on dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
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

// handle unhandled promise rejection connection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.bgRed)
  // close server and exit the processs
  server.close(() => process.exit(1))
})
