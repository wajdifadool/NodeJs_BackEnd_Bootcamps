const fs = require('fs')
const mongoose = require('mongoose')

const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Load Modles
const Bootcamp = require('./model/Bootcamp')
const Course = require('./model/Course')
const User = require('./model/User')
const Review = require('./model/Review')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  // console.log(
  //   colors.green(`🍃 MongoDB connected:  ${conn.connection.host} 🍃 `.bold)
  // )
}
connectDB()

// connectDB()

// read json file for bootcamps
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`),
  'utf-8'
)
// read json file for Courses
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`),
  'utf-8'
)

// read json file for users
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`),
  'utf-8'
)

// read json file for reviews
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`),
  'utf-8'
)
// Import into db
const impotData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log('data Imported to the db ...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany() // de;lete the whole data base
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('data Deleted from the db ...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === '-i') {
  impotData()
} else if (process.argv[2] === '-d') {
  deleteData()
}

// connectDB()
