const express = require('express')
const router = express.Router({ mergeParams: true }) //
const Course = require('../model/Course')

const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createCourse,
} = require('../controlers/courses')

const { protect, authorize } = require('../middleware/auth')

const advancedResults = require('../middleware/advancedResult') // midlleware
router
  .route('/')
  .post(protect, authorize('publisher', 'admin'), createCourse)
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router

// mogodb  ---> mongoose ---> f(x) =
