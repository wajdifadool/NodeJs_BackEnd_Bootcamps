const express = require('express')
const router = express.Router({ mergeParams: true }) //

const { getCourses } = require('../controlers/courses')

router.route('/').get(getCourses)

module.exports = router

// mogodb  ---> mongoose ---> f(x) =
