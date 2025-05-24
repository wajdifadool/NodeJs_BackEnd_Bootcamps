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

const { protect } = require('../middleware/auth')

const Bootcamp = require('../model/Bootcamp')
const advancedResults = require('../middleware/advancedResult') // midlleware

// Include other resourse router
const courseRouter = require('./courses')
//Re-route into other resourse router
// mounted to the courseRouter
// which means will be routed to the Course Router End point ( the courses.js file) //but make sure we include in the routes/course.js the follwing object to the Router {mergeParams:true}
router.use('/:bootcampId/courses', courseRouter)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)

/**
 * Exaplionation : .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
 * so basicly the get advanced resul
 */
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp)

router
  .route('/:id')
  .get(getBootcamp)

  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)

module.exports = router

// mogodb  ---> mongoose ---> f(x) =
