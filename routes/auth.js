const express = require('express')
const router = express.Router()

const {
  register,
  login,
  logout,

  getMe,
  forgetpassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controlers/auth')
const { protect } = require('../middleware/auth')

router.route('/register').post(register)

router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/me').get(protect, getMe)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/updatepassword').put(protect, updatePassword)
router.route('/forgetpassword').post(forgetpassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
module.exports = router
