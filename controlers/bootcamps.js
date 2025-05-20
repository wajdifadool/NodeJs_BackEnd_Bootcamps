const Bootcamp = require('../model/Bootcamp')
const mongoose = require('mongoose')
const errorResponse = require('../utils/errorResponse')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
/// this is middleware functions
// mongoose.set('debug', true)
const qs = require('qs')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const parsedQuery = qs.parse(req.query)

  // Remove reserved fields from query
  const fieldsToRemove = ['select', 'sort', 'page', 'limit']
  fieldsToRemove.forEach((field) => delete parsedQuery[field])

  // Convert operators (gt, gte, lt, etc.)
  let queryStr = JSON.stringify(parsedQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  const finalQuery = JSON.parse(queryStr)

  // Recursively convert strings that look like numbers to real numbers
  const convertValues = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        convertValues(obj[key])
      } else if (/^-?\d+(\.\d+)?$/.test(obj[key])) {
        obj[key] = Number(obj[key])
      }
    }
  }
  convertValues(finalQuery)

  // Initialize query
  let query = Bootcamp.find(finalQuery).populate('courses')

  // Handle field selection
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Handle sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt') // default sort
  }

  //   Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit //
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()
  query = query.skip(startIndex).limit(limit)

  // Execute query
  const results = await query

  //   pagination result
  const pagination = {}

  // endINdex = 100
  // totla = 30
  // 100 < 30
  //   shows next page only if we not in the last page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    }
  }

  //   shows prev page only if we not in the first page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }
  res.status(200).json({
    success: true,
    count: results.length,
    pagination,
    data: results,
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
  const bootcampPromise = await Bootcamp.findById(id)
  //   {new:true} : will return the new updated Model
  if (!bootcampPromise) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }
  await bootcampPromise.deleteOne()

  res.status(200).json({
    succsess: true,
    data: {},
  })
})
