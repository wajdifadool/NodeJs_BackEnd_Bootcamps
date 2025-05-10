const colors = require('colors')
const express = require('express')
const dotenv = require('dotenv')

//Route file
const bootcamps = require('./routes/bootcamps')

// Load ENV VARS
dotenv.config({
  path: './config/config.env',
})

// init the app variable
const app = express()

// all miidleware functions have (req , res , next)
const looger = (req, res, next) => {
  // it have acces to to req
  // we set value on the req object then we can access in any route that come after this midlleware

  req.hello = 'hello looger' // we can access .hello in any route becuse we have app.use(looger) meaning the app insert the looger in the cycle
  console.log('middleware ran')
  // we call next so ot moves to the next piece of middlware in the cycle
  next()
}
app.use(looger)
// mount routers
app.use('/api/v1/bootcamps', bootcamps)

// to run the server we have to listen to ( http module )
// BASIC TESTING
app.get('/', (req, res) => {
  res.json({ succsess: true, message: 'Server Running al good' }).status(200)
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // Call back
  const text =
    `listneng to port ${PORT}\nlistneng in mode ${process.env.NODE_ENV}`.bgWhite
      .green
  console.log(text)
})
