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
const { protect } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult') // midlleware
router
  .route('/')
  .post(protect, createCourse)
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
  .put(protect, updateCourse)
  .delete(protect, deleteCourse)

module.exports = router

// mogodb  ---> mongoose ---> f(x) =
