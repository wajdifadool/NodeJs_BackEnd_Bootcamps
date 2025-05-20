const fs = require('fs')
const mongoose = require('mongoose')

const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Load Modles
const Bootcamp = require('./model/Bootcamp')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(
    colors.green(`🍃 MongoDB connected:  ${conn.connection.host} 🍃 `.bold)
  )
}
connectDB()

// connectDB()

// read json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`),
  'utf-8'
)

// Import into db
const impotData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('data Imported to the db ...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany() // de;lete the whole data base
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
