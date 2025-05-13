const Bootcamp = require('../model/Bootcamp')

const mongoose = require('mongoose')

/// this is middleware functions

/*
TODO: handles errors by name /kind 
1:  
"kind": "ObjectId",
"name": "CastError",

*/
// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @acsess  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcampPromise = await Bootcamp.find()
    const count = bootcampPromise.length

    res.status(200).json({
      succsess: true,
      count: count,
      data: bootcampPromise,
    })
  } catch (error) {
    // TODO: handle each error spereatly

    // TODO:wrap with async handler
    res.status(400).json({
      succsess: false,
      data: [],
      error: error.message,
    })
  }
  //   const bootcampPromise = await Bootcamp.create(req.body)
  //   res.status(201).json({
  //     succsess: true,
  //     data: bootcampPromise,
  //   })

  //   console.log(req.body)
  //   res
  //     .json({
  //       succsess: true,
  //       message: `all bootcamps goes here ${req.hello}`,
  //     })
  //     .status(200)
}

// @desc    Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @acsess  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcampPromise = await Bootcamp.findById(req.params.id)

    if (!bootcampPromise) {
      return res.status(400).json({
        succsess: false,
      })
    }

    res.status(200).json({
      succsess: true,
      data: bootcampPromise,
    })
  } catch (error) {
    // TODO: handle each error spereatly

    // TODO:wrap with async handler
    res.status(400).json({
      succsess: false,
      data: [],
      error: error,
    })
  }

  //   res
  //     .json({
  //       succsess: true,
  //       message: `/api/v1/bootcamps/:id / get bootcamps goes here ${req.params.id} `,
  //     })
  //     .status(200)
}

// @desc    Create new  bootcamp
// @route   POST /api/v1/bootcamps
// @acsess  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcampPromise = await Bootcamp.create(req.body)
    res.status(201).json({
      succsess: true,
      data: bootcampPromise,
    })
  } catch (error) {
    // TODO: handle each eror spereatly
    console.log(Object.keys(error))

    // TODO:wrap with async handler
    res.status(400).json({
      succsess: false,
      data: [],
    })
  }

  //   res
  //     .json({
  //       succsess: true,
  //       message: `POST /api/v1/bootcamps/  bootcamps create function `,
  //     })
  //     .status(200)
}

// @desc    Update existing  bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acsess  Private
exports.updateBootcamp = async (req, res, next) => {
  const id = req.params.id
  console.log(id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid bootcamp ID format',
    })
  }

  try {
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
      return res.status(400).json({
        succsess: false,
      })
    }

    res.status(200).json({
      succsess: true,
      data: bootcampPromise,
    })
  } catch (error) {
    // TODO: handle each eror spereatly
    console.log(Object.keys(error))

    // TODO:wrap with async handler
    res.status(400).json({
      succsess: false,
      data: [],
    })
  }
}

// @desc    Delete existing bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acsess  Private
exports.deleteBootcamp = async (req, res, next) => {
  const id = req.params.id
  console.log(id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid bootcamp ID format',
    })
  }

  try {
    const bootcampPromise = await Bootcamp.findByIdAndDelete(id)
    //   {new:true} : will return the new updated Model
    if (!bootcampPromise) {
      return res.status(400).json({
        succsess: false,
      })
    }

    res.status(200).json({
      succsess: true,
      data: {},
    })
  } catch (error) {
    // TODO: handle each eror spereatly

    // TODO:wrap with async handler
    res.status(400).json({
      succsess: false,
      data: [],
    })
  }
}
