const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))
app.use(express.json())

// Static files
app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/notes", require("./routes/noteRoutes"))
app.use("/api/notifications", require("./routes/notificationRoutes"))

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀")
})

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err))

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})