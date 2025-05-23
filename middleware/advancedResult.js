const qs = require('qs')

const advancedResults = (model, populate) => async (req, res, next) => {
  const parsedQuery = qs.parse(req.query)

  // Remove reserved fields from query
  const fieldsToRemove = ['select', 'sort', 'page', 'limit']
  // Loop over removeFields and delete them from reqQuery

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
  let query = model.find(finalQuery)

  // Select Fields

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
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
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  // Execute query
  const results = await query

  // Pagination result
  const pagination = {}

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
