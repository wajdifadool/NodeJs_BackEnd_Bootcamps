const express = require('express')
const router = express.Router()

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require('../controlers/bootcamps')

// Include other resourse router
const courseRouter = require('./courses')
//Re-route into other resourse router
// mounted to the courseRouter
// which means will be routed to the Course Router End point ( the courses.js file) //but make sure we include in the routes/course.js the follwing object to the Router {mergeParams:true}
router.use('/:bootcampId/courses', courseRouter)

router.route('/:id/photo').put(bootcampPhotoUpload)

router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router

// mogodb  ---> mongoose ---> f(x) =
