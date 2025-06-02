const mongoose = require('mongoose')
const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const sendEmail = require('../utils/sendEmail')
const User = require('../model/User')

const mongoSanitize = require('mongo-sanitize')

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
  // we can santize the data from here but we used midlleware! in server.js
  // mongoSanitize(req.body.email)
  // mongoSanitize(req.body.password)

  const { email, password } = req.body

  // console.log(req.body)
  // console.log(sanitizedEmail, sanitizedPassword)
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

// @desc    Log user out / clear Cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    data: {},
  })
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

// @desc    Forget password
// @route   GET /api/v1/auth/forgetpassword
// @access  Public
// exports.forgetpassword = asyncHandler(async (req, res, next) => {
//   if (!req.body.email) {
//     return next(new ErrorResponse(` provide an email .`, 400))
//   }
//   const user = await User.findOne({
//     email: req.body.email,
//   })

//   if (!user) {
//     return next(
//       new ErrorResponse(`no user found with email ${req.body.email}.`, 404)
//     )
//   }
//   await user.save({ validateBeforeSave: false })
//   // get reset Token
//   const resetToken = user.getResetPasswordToken()
//   console.log(resetToken)

//   //create rest url
//   const resetUrl = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/resetpassword/${resetToken}`

//   const message = `to reset password for the email you provided please make a PUT request to:\n\n ${resetUrl}`

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Password reset token request',
//       message: message,
//     })

//     res.status(200).json({
//       succsess: true,
//     })
//   } catch (err) {
//     console.log(err)
//     // if something went worng , make sure to clear the tokens and save in the databse
//     user.resetPasswordToken = undefined
//     user.resetPasswordExpire = undefined

//     await user.save({ validateBeforSave: false })
//     return next(new ErrorResponse('Email could not be sent', 500))
//   }

//   res.status(200).json({
//     succsess: true,
//     token: resetToken,
//     data: user,
//   })
//   //   ok great we have a match
//   // sendTokenResponse(user, 200, res)
// })

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgetpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // we have accses to req.user via the protect middleware

  // get the token and hashed it so we can comapare waht ever in the data base
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  // find the user  by the reset token
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // make sure the reset token time is not expired
  })

  if (!user) {
    return next(new ErrorResponse('inavlid Token', 400))
  }

  // set the new password now and encryptit
  user.password = req.body.password

  // reset token and expersiotn time  in db
  user.resetPasswordExpire = undefined
  user.resetPasswordToken = undefined

  await user.save()

  sendTokenResponse(user, 200, res)
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
