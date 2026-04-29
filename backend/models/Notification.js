const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
  message: String,
  userEmail: String,   // who should receive
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Notification", NotificationSchema)