const mongoose = require('mongoose')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const User = require('../model/User')

// @desc    Rgister User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  //create user
  const user = await User.create({
    name,
    email,
    password,
  })

  //   create token
  // statics are called on the actual method we getting from the model

  const token = user.getSignedJwtToken()

  res
    .status(200)
    .json({ message: 'regesiter user ...', token: token, user: user })
})
// @desc    LOGIN User
// @route   Post /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // get the data
  const { email, password } = req.body
  //   validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('provide email and password ', 400))
  }

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

  //   create token
  // statics are called on the actual method we getting from the model
  const token = user.getSignedJwtToken()

  res.status(200).json({ message: 'regesiter user ...', token: token })
})
