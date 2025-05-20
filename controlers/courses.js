//======= Models =======\\
const Bootcamp = require('../model/Bootcamp')
const Course = require('../model/Course')
//======= Libs =======\\
const mongoose = require('mongoose')
const qs = require('qs')
// Middlewares
const asyncHandler = require('../middleware/async')
/// this is middleware functions
// mongoose.set('debug', true)

// @desc    Get  Courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // get the courses for the cuurent bootcamp
  let query
  if (req.params.bootcampId) {
    query = Course.find({
      bootcamp: req.params.bootcampId, // in the schema we have filed called bootcamp with objectId ,
    })
  } else {
    // @route   GET /api/v1/bootcamps/:bootcampId/
    query = Course.find()
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})
