const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")

// 📥 Get notifications for user
router.get("/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userEmail: req.params.email
    }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (err) {
    console.log("NOTIFICATION ERROR:", err)
    res.status(500).json({ message: "Error fetching notifications" })
  }
})

module.exports = router