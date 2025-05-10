/// this is middleware functions

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @acsess  Public
exports.getBootcamps = (req, res, next) => {
  res
    .json({ succsess: true, message: `all bootcamps goes here ${req.hello}` })
    .status(200)
}

// @desc    Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @acsess  Public
exports.getBootcamp = (req, res, next) => {
  res
    .json({
      succsess: true,
      message: `/api/v1/bootcamps/:id / get bootcamps goes here ${req.params.id} `,
    })
    .status(200)
}

// @desc    Create new  bootcamp
// @route   POST /api/v1/bootcamps
// @acsess  Private
exports.createBootcamp = (req, res, next) => {
  res
    .json({
      succsess: true,
      message: `POST /api/v1/bootcamps/  bootcamps create function `,
    })
    .status(200)
}

// @desc    Update existing  bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acsess  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .json({
      succsess: true,
      message: `PUT /api/v1/bootcamps/:id bootcamps goes here ${req.params.id} `,
    })
    .status(200)
}

// @desc    Delete existing bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acsess  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .json({
      succsess: true,
      message: `delete /api/v1/bootcamps/:id bootcamps goes here ${req.params.id} `,
    })
    .status(200)
}
