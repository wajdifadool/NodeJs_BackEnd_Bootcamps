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
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

// @desc    Get single Course
// @route   Get /api/v1/courses/:id
// @acsess  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  let query
  query = Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  const course = await query
  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    succsess: true,
    data: course,
  })
})

// @desc    Add single Course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @acsess  Public
exports.createCourse = asyncHandler(async (req, res, next) => {
  // get the bootcamp id
  console.log('course.js//createCourse() ')
  const id = req.params.bootcampId
  // add the id to the body manualy hence the Course schema contaions bootcampID
  req.body.bootcamp = id

  let query
  query = Bootcamp.findById(id)

  const bootcamp = await query

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }
  // we found the bootcamp, create the course
  const course = await Course.create(req.body)

  res.status(200).json({
    succsess: true,
    data: course,
  })
})

// @desc    Update existing course
// @route   PUT /api/v1/courses/:id
// @acsess  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const coursePromise = await Course.findByIdAndUpdate(
    id,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  )
  //   {new:true} : will return the new updated Model
  if (!coursePromise) {
    return next(
      new ErrorResponse(`Course Not found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    succsess: true,
    data: coursePromise,
    message: 'course updated successfully!',
  })
})

// @desc    Delete existing course
// @route   PUT /api/v1/courses/:id
// @acsess  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const coursePromise = await Course.findByIdAndDelete(id)
  //   {new:true} : will return the new updated Model
  if (!coursePromise) {
    return next(
      new ErrorResponse(`Course Not found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    succsess: true,
    data: coursePromise,
    message: 'course deleted successfully!',
  })
})
