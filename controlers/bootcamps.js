const Bootcamp = require('../model/Bootcamp')
const mongoose = require('mongoose')
const path = require('path')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

/// this is middleware functions
// mongoose.set('debug', true)
const qs = require('qs')
const { deleteFile } = require('../helpers/fileHelper')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// exports.getBootcamps = asyncHandler(async (req, res, next) => {
//   const parsedQuery = qs.parse(req.query)

//   // Remove reserved fields from query
//   const fieldsToRemove = ['select', 'sort', 'page', 'limit']
//   fieldsToRemove.forEach((field) => delete parsedQuery[field])

//   // Convert operators (gt, gte, lt, etc.)
//   let queryStr = JSON.stringify(parsedQuery)
//   queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
//   const finalQuery = JSON.parse(queryStr)

//   // Recursively convert strings that look like numbers to real numbers
//   const convertValues = (obj) => {
//     for (const key in obj) {
//       if (typeof obj[key] === 'object' && obj[key] !== null) {
//         convertValues(obj[key])
//       } else if (/^-?\d+(\.\d+)?$/.test(obj[key])) {
//         obj[key] = Number(obj[key])
//       }
//     }
//   }
//   convertValues(finalQuery)

//   // Initialize query
//   let query = Bootcamp.find(finalQuery).populate('courses')

//   // Handle field selection
//   if (req.query.select) {
//     const fields = req.query.select.split(',').join(' ')
//     query = query.select(fields)
//   }

//   // Handle sorting
//   if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ')
//     query = query.sort(sortBy)
//   } else {
//     query = query.sort('-createdAt') // default sort
//   }

//   //   Pagination
//   const page = parseInt(req.query.page, 10) || 1
//   const limit = parseInt(req.query.limit, 10) || 25
//   const startIndex = (page - 1) * limit //
//   const endIndex = page * limit
//   const total = await Bootcamp.countDocuments()
//   query = query.skip(startIndex).limit(limit)

//   // Execute query
//   const results = await query

//   //   pagination result
//   const pagination = {}

//   // endINdex = 100
//   // totla = 30
//   // 100 < 30
//   //   shows next page only if we not in the last page
//   if (endIndex < total) {
//     pagination.next = {
//       page: page + 1,
//       limit: limit,
//     }
//   }

//   //   shows prev page only if we not in the first page
//   if (startIndex > 0) {
//     pagination.prev = {
//       page: page - 1,
//       limit,
//     }
//   }
//   res.status(200).json({
//     success: true,
//     count: results.length,
//     pagination,
//     data: results,
//   })
// })

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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
  console.log('cerateing Bootcamp!! createBootcamp() ')
  // Add user to req.body

  req.body.user = req.user.id // passed from the protect middleware basicly this is the logged in user

  console.log(req.body.user)
  console.log(req.user.id)
  // Puplisher (can add only one bootcamp)
  // admin can add as many
  // user none
  // check for published bootcamp under the looged in user
  const publishedBootcamp = await Bootcamp.findOne({
    user: req.user.id,
  })
  // if the user is not admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    message = `the user with the id of ${req.user.id} reached maximum bootcamps allowed `
    return next(new ErrorResponse(message, 404))
  }

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

  let bootcampPromise = await Bootcamp.findById(id)
  // vlaidate ownership
  const owner = bootcampPromise.user.toString()
  if (owner !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to update bootcamp for the current user ${req.user.id}`,
        401
      )
    )
  }
  if (!bootcampPromise) {
    return next(
      new ErrorResponse(
        `Bootcamp Not found with the id of ${req.params.id}`,
        404
      )
    )
  }
  // do the actual update
  bootcampPromise = await Bootcamp.findByIdAndUpdate(
    id,
    { $set: req.body },
    {
      //   {new:true} : will return the new updated Model
      new: true,
      runValidators: true,
    }
  )

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
  const owner = bootcampPromise.user.toString()
  if (owner !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to delete bootcamp for the current user ${req.user.id}`,
        401
      )
    )
  }

  await bootcampPromise.deleteOne()

  if (bootcampPromise.photo) {
    deleteFile(bootcampPromise.photo)
  }

  res.status(200).json({
    succsess: true,
    data: {},
  })
})

// @desc    Upload photo for  bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @acsess  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
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
  const owner = bootcampPromise.user.toString()
  if (owner !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not Authorized to update bootcamp for the current user ${req.user.id}`,
        401
      )
    )
  }

  // check if file is there
  if (!req.files) {
    return next(new ErrorResponse(`please upload image file`, 400))
  }

  const file = req.files.file
  // validation
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`please upload image file`, 400))
  }
  if (file.size > process.env.FILE_UPLOAD_MAX) {
    return next(
      new ErrorResponse(
        `please upload image size lte ${process.env.FILE_UPLOAD_MAX}`,
        400
      )
    )
  }

  // create custom file name
  const file_name_ext = path.parse(file.name).ext
  file.name = `photo_${bootcampPromise._id}${file_name_ext}`

  // Upload the file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      new ErrorResponse(`Something went worng uploading the file`, 500)
    }
    // insert to data base
    await Bootcamp.findByIdAndUpdate(id, { photo: file.name })
  })

  res.status(200).json({
    succsess: true,
    data: file.name,
    message: 'uploaded image Successfuly',
  })
})
