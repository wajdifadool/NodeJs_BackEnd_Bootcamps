const mongoose = require('mongoose')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const User = require('../model/User')

// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res) // send a token in the cookie
})
// @desc    Login sser
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // get the data
  const { email, password } = req.body
  //   validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('provide email and password ', 400))
  }

  //   https://mongoosejs.com/docs/api/model.html#example
  //create user
  const user = await User.findOne({
    email: email,
  }).select('+password') // include password for login

  if (!user) {
    return next(new ErrorResponse('invalid Credentials ', 401))
  }

  //   check if password mathes
  const isMatchPassword = await user.matchPassword(password)
  if (!isMatchPassword) {
    return next(new ErrorResponse('invalid Credentials ', 401))
  }
  //   ok great we have a match
  sendTokenResponse(user, 200, res)
})

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // we have accses to req.user via the protect middleware
  const user = await User.findById(req.user.id)

  res.status(200).json({ succsess: true, data: user })
  //   ok great we have a match
  // sendTokenResponse(user, 200, res)
})

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //   create token
  // statics are called on the actual method we getting from the model
  const token = user.getSignedJwtToken()
  const options = {
    // 30 days experies
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 864e5),
    httpOnly: true,
  }

  //   send cookie with https just for production mode by seting secure:true
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  res
    //
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token: token })
}
