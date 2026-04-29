const express = require("express")
const router = express.Router()
const User = require("../models/User")

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" })
    }

    const user = await User.create({ email, password })

    res.json(user)
  } catch (err) {
    res.status(500).json({ msg: "Server error" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: "User not found" })
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid password" })
    }

    // Send response (without password)
    res.json({
      msg: "Login successful",
      user: {
        email: user.email,
        username: user.username
      }
    })

  } catch (err) {
    res.status(500).json({ msg: "Server error" })
  }
})

module.exports = router