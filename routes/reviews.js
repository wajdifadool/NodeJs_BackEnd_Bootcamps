const express = require('express')
const router = express.Router({ mergeParams: true }) //
const Review = require('../model/Review')

const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult') // midlleware

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controlers/reviews')

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)
module.exports = router

// mogodb  ---> mongoose ---> f(x) =
