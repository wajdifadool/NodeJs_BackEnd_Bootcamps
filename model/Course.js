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
      type: String,
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

    //   relation Ship to bbotcamp
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: true,
    },
  }
  // this is second params
)

module.exports = mongoose.model('Course', CourseSchema)
