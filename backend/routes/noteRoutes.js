const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")

const Note = require("../models/Note")
const User = require("../models/User")
const Notification = require("../models/Notification")

// 📁 Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// 📤 Upload Note + 🔔 Notifications
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, userEmail , username } = req.body

    // ✅ Validation
    if (!title || !req.file || !userEmail) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // ✅ Save Note
    const newNote = await Note.create({
      title,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      userEmail,
      username
    })
    

    // 🔥 Get all users except uploader
    const users = await User.find({ email: { $ne: userEmail } })

    // 🔔 Create notifications
    const notifications = users.map(user => ({
      userEmail: user.email,
      message: `${userEmail} uploaded "${title}"`
    }))

    if (notifications.length > 0) {
      await Notification.insertMany(notifications)
    }

    res.json({
      message: "File uploaded & notifications created",
      note: newNote
    })

  } catch (error) {
    console.log("UPLOAD ERROR:", error)
    res.status(500).json({ message: "Upload failed" })
  }
})


// 🌍 GET ALL NOTES (GLOBAL SYSTEM)
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    console.log("FETCH NOTES ERROR:", error)
    res.status(500).json({ message: "Error fetching notes" })
  }
})


// ❌ Delete Note (ONLY OWNER SHOULD DELETE)
router.delete("/delete/:id", async (req, res) => {
  try {
    const { userEmail } = req.body // 🔥 get current user

    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // 🔥 SECURITY: only uploader can delete
    if (note.userEmail !== userEmail) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // ✅ Delete file safely
    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath)
    }

    // ✅ Delete from DB
    await Note.findByIdAndDelete(req.params.id)

    res.json({ message: "Note deleted successfully" })

  } catch (error) {
    console.log("DELETE ERROR:", error)
    res.status(500).json({ message: "Delete failed" })
  }
})

module.exports = router