const Bootcamp = require('../model/Bootcamp')
const mongoose = require('mongoose')
const errorResponse = require('../utils/errorResponse')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
/// this is middleware functions

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @acsess  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Async Handler is HOF that run the code and errors is catched in it and the catched error will invoke the next
  // if there is an error the async handler run it

  const bootcampPromise = await Bootcamp.find()
  const count = bootcampPromise.length

  res.status(200).json({
    succsess: true,
    count: count,
    data: bootcampPromise,
  })
})

// @desc    Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @acsess  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcampPromise = await Bootcamp.findById(req.params.id)
  if (!bootcampPromise) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    succsess: true,
    data: bootcampPromise,
  })
})
// @desc    Create new  bootcamp
// @route   POST /api/v1/bootcamps
// @acsess  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcampPromise = await Bootcamp.create(req.body)
  res.status(201).json({
    succsess: true,
    data: bootcampPromise,
  })
})

// @desc    Update existing  bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acsess  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const bootcampPromise = await Bootcamp.findByIdAndUpdate(
    id,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  )
  //   {new:true} : will return the new updated Model
  if (!bootcampPromise) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    succsess: true,
    data: bootcampPromise,
  })
})

// @desc    Delete existing bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acsess  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const bootcampPromise = await Bootcamp.findByIdAndDelete(id)
  //   {new:true} : will return the new updated Model
  if (!bootcampPromise) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    succsess: true,
    data: {},
  })
})
