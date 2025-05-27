const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add Course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add Course description'],
    },

    weeks: {
      type: String,
      required: [true, 'Please add Course duration in weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add Course tuition'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add Course minimum Skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailbale: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    //   relationship to bootcamp
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  }
  // this is second params
)
/**
 * 📊 Static Method: getAvergeCost
 * ------------------------------------
 * This method calculates the average tuition cost for all courses
 * associated with a specific bootcamp.
 *
 * ❗ Static methods in Mongoose are defined on the Model (not individual documents),
 *    so we use `this` to refer to the entire Course model.
 *
 * 🚫 NOTE: Do NOT use an arrow function here — arrow functions do NOT have their own `this`,
 *    so `this.aggregate()` would be undefined. Use a regular function expression.
 *
 * @param {ObjectId} bootcampId - The ID of the bootcamp to match courses against
 */
CourseSchema.statics.getAvergeCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      /**
       * 🎯 Step 1: Match stage
       * ----------------------
       * Filters the documents (courses) where the "bootcamp" field matches the given bootcampId.
       *
       * 🔍 "bootcamp" here refers to this field in the Course schema:
       *     bootcamp: {
       *       type: mongoose.Schema.ObjectId,
       *       ref: 'Bootcamp',
       *       required: true,
       *     }
       *
       * This limits the aggregation to only courses that belong to the specified bootcamp.
       */
      $match: { bootcamp: bootcampId },
    },
    {
      /**
       * 🧮 Step 2: Group stage
       * -----------------------
       * Groups all matched courses by their "bootcamp" field and calculates the average tuition.
       *
       * - `_id: '$bootcamp'`: Groups courses by the bootcamp ObjectId.
       * - `averageCost: { $avg: '$tuition' }`: Calculates the average of the "tuition" field.
       *
       * 💡 Note: "$tuition" refers to the "tuition" field in the Course schema:
       *     tuition: {
       *       type: String, // should ideally be Number for math operations
       *       required: true
       *     }
       *
       * Mongoose and MongoDB will coerce numeric strings like "10000" into numbers here,
       * but it's safer long-term to store tuition as a Number type.
       */
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ])

  // console.log(obj) // Logs result like: [{ _id: <bootcampId>, averageCost: 8500 }]

  try {
    // No courses found — reset averageCost
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    })
  } catch (error) {
    console.error(
      'error at updating the average Cost in the statics method',
      error.message
    )
  }
}

// call get average cost after save
CourseSchema.post('save', function () {
  // update the avergae cost for bootcamp
  this.constructor.getAvergeCost(this.bootcamp)
})

// call get average cost before remove
CourseSchema.pre('remove', function () {
  this.constructor.getAvergeCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
