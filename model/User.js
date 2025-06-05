const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const randomize = require('randomatic')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allows multiple users without googleId
  },

  photo: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // will not return the password
  },
  resetPasswordToken: String, // for reseting the password
  resetPasswordExpire: Date, // password expires time
  confirmEmailToken: String, //
  //   isEmailConfirmed: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   twoFactorCode: String,
  //   twoFactorCodeExpire: Date,
  //   twoFactorEnable: {
  //     type: Boolean,
  //     default: false,
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// // Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  /* make sure it runs only when save is modifed/provided , in otherwords it runs only when th user login/register/updatepassword*/
  if (!this.isModified('password')) {
    next() // move along to next middleware
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// // Encrypt password using bcrypt while updating (admin)
// UserSchema.pre("findOneAndUpdate", async function (next) {
//   if (this._update.password) {
//     this._update.password = await bcrypt.hash(this._update.password, 10);
//   }
//   next();
// });

// // Sign JWT and return
// read more at:https://www.npmjs.com/package/jsonwebtoken for the libary
// read more at: https://jwt.io/

UserSchema.methods.getSignedJwtToken = function () {
  const data = { id: this._id }
  const secret = process.env.JWT_SECRET
  const expIn = {
    expiresIn: process.env.JWT_EXPIRE,
  }
  return jwt.sign(data, secret, expIn)
}

// // Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
} // returns apromise

// // Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field in the userSchema model
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken // note not
}

// // Generate email confirm token
// UserSchema.methods.generateEmailConfirmToken = function (next) {
//   // email confirmation token
//   const confirmationToken = crypto.randomBytes(20).toString('hex');

//   this.confirmEmailToken = crypto
//     .createHash('sha256')
//     .update(confirmationToken)
//     .digest('hex');

//   const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
//   const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
//   return confirmTokenCombined;
// };

module.exports = mongoose.model('User', UserSchema)
