const colors = require('colors')
const express = require('express')
const dotenv = require('dotenv')

// Load ENV VARS
dotenv.config({
  path: './config/config.env',
})

// init the app variable
const app = express()

// to run the server we have to listen to ( http module )

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // Call back
  const text =
    `listneng to port ${PORT}\nlistneng in mode ${process.env.NODE_ENV}`.bgWhite
      .green
  console.log(text)
})
