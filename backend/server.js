const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// ✅ Middleware FIRST
app.use(cors())
app.use(express.json())

// ✅ Serve uploaded files
app.use("/uploads", express.static("uploads"))

// ✅ Routes AFTER middleware
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/notes", require("./routes/noteRoutes"))



app.use("/api/notifications", require("./routes/notificationRoutes"))
// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀")
})

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err))

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000")
})