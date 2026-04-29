const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
  title: String,
  fileName: String,
  filePath: String,
  fileType: String,
  userEmail: String,
  username : String
})

module.exports = mongoose.model("Note", noteSchema)