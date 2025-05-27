//======= Models =======\\
const Bootcamp = require('../model/Bootcamp')
const Course = require('../model/Course')
//======= Libs =======\\
const mongoose = require('mongoose')
const ErrorResponse = require('../utils/errorResponse')
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
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId, // in the schema we have filed called bootcamp with objectId ,
    })
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    // @route   GET /api/v1/bootcamps/:bootcampId/
    res.status(200).json(res.advancedResults)
  }
})

// exports.getCourses = asyncHandler(async (req, res, next) => {
//   // get the courses for the cuurent bootcamp
//   let query
//   if (req.params.bootcampId) {
//     query = Course.find({
//       bootcamp: req.params.bootcampId, // in the schema we have filed called bootcamp with objectId ,
//     })
//   } else {
//     // @route   GET /api/v1/bootcamps/:bootcampId/
//     query = Course.find().populate({
//       path: 'bootcamp',
//       select: 'name description',
//     })
//   }

//   const courses = await query

//   res.status(200).json({
//     success: true,
//     count: courses.length,
//     data: courses,
//   })
// })

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
  const bootcampId = req.params.bootcampId
  const userId = req.user.id

  // add the id to the body manualy hence the Course schema contaions bootcampID
  req.body.bootcamp = bootcampId
  req.body.user = userId

  let query
  query = Bootcamp.findById(bootcampId)

  const bootcamp = await query

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with the id of ${bootcampId}`, 404)
    )
  }

  const owner = bootcamp.user.toString()
  if (owner !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to create Course for this bootcamp ${req.user.id}`,
        401
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
  // 6835f178610ec69b152ccb2b
  const id = req.params.id
  const course = await Course.findById(id)

  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with the id of ${req.params.id}`, 404)
    )
  }

  // TODO: move to middleware
  const looged_user_id = req.user.id
  const creator_user_id = course.user.toString()

  if (creator_user_id !== looged_user_id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to update bootcamp for the current user ${req.user.id}`,
        401
      )
    )
  }
  // -----

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
    message: 'successfully updated!',
  })
})

// @desc    Delete existing course
// @route   PUT /api/v1/courses/:id
// @acsess  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const course = await Course.findById(id)

  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with the id of ${req.params.id}`, 404)
    )
  }

  // TODO: move to middleware
  const looged_user_id = req.user.id
  const creator_user_id = course.user.toString()

  if (creator_user_id !== looged_user_id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to delete this Course for the current user ${req.user.id}`,
        401
      )
    )
  }

  await Course.findByIdAndDelete(id)

  res.status(200).json({
    succsess: true,
    message: 'successfully deleted!',
  })
})
