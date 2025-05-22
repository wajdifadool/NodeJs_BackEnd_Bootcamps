const fs = require('fs')
const path = require('path')

const deleteFile = (fileName) => {
  // Construct the full file path using env var
  const filePath = path.join(process.env.FILE_UPLOAD_PATH, fileName)

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  console.log(`deleted bootcamp image ${fileName}`)
}

module.exports = { deleteFile }
