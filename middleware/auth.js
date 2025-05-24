// this auth.js used to protect routes

const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')

const ErrorResponse = require('../utils/errorResponse')
const User = require('../model/User')

// protect route middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token
  console.log('Protect middleware have been called')

  // check for authriztion headers, since we send the jwt in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  //   else if (req.cookies.token) {
  //     token = req.cookies.token
  //   }

  // make sure token  exisets
  if (!token) {
    return next(new ErrorResponse('not authorized', 401))
  }

  //   verify token by extracting the payload id from it
  try {
    // const payload = jwt.decode(token)
    // console.log(payload)

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    // pass the loged in user to the req next midlleware
    req.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    console.log(error)
    return next(new ErrorResponse('not authorized', 401))
  }
})
