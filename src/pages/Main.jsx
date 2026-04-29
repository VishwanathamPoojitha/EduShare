import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import pdfIcon from '../assets/pdf.webp'
import { Link } from 'react-router-dom'
import { FaBell } from "react-icons/fa"

const Main = () => {

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)

  const [search, setSearch] = useState('')

  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()
  const profileRef = useRef()

  // ✅ Get user
  useEffect(() => {
    const updateUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      setUser(storedUser)
    }

    updateUser()
    window.addEventListener("userChanged", updateUser)

    return () => window.removeEventListener("userChanged", updateUser)
  }, [])

  // ✅ Fetch ALL notes (GLOBAL)
  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notes/notes")
      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    window.dispatchEvent(new Event("userChanged"))
    navigate("/")
  }

  // ✅ Upload
  const handleUpload = async () => {
    if (!title || !file) {
      alert("Please enter title and file")
      return
    }

    const storedUser = JSON.parse(localStorage.getItem("user"))

    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)
    formData.append("userEmail", storedUser.email) 
    formData.append("username", storedUser?.username || storedUser?.email)

    try {
      const res = await fetch("http://localhost:5000/api/notes/upload", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        alert("Uploaded successfully ✅")

        setTitle('')
        setFile(null)

        fetchNotes()
        fetchNotifications() // 🔥 refresh notifications
      } else {
        alert("Upload failed")
      }

    } catch (error) {
      console.log(error)
    }
  }

  // ✅ DELETE (SECURE)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?")
    if (!confirmDelete) return

    const storedUser = JSON.parse(localStorage.getItem("user"))

    try {
      const res = await fetch(`http://localhost:5000/api/notes/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userEmail: storedUser.email })
      })

      if (res.ok) {
        alert("Deleted successfully ✅")
        fetchNotes()
      } else {
        alert("Not allowed to delete")
      }

    } catch (error) {
      console.log(error)
    }
  }

  // Search
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.fileName.toLowerCase().includes(search.toLowerCase())
  )

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  const fetchNotifications = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (!storedUser) return

    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${storedUser.email}`)
      const data = await res.json()

      setNotifications(data)
      setUnreadCount(data.length)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  console.log(filteredNotes)

  return (
    <div className='Main_page'>

      {/* Navbar */}
    <nav>

  <div className="nav_top">
    <Link to="/">
      <h4 style={{ cursor: "pointer", color: "white" }}>🕮</h4>
    </Link>

    <div className="nav_icons">
      <div className="notification_container">
        <FaBell 
          size={22} 
          onClick={() => {
            setShowNotifications(!showNotifications)
            setUnreadCount(0)
          }}
        />

        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}

        {showNotifications && (
          <div className="notification_dropdown">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <p key={i}>{n.message}</p>
              ))
            )}
          </div>
        )}
      </div>

      <div className="profile_container" ref={profileRef}>
        <h5 onClick={() => setShowProfile(!showProfile)}>👤</h5>

        {showProfile && (
          <div className="profile_dropdown">
            <p>{user?.email || "user@gmail.com"}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  </div>

  <input 
    type="search" 
    placeholder="🔎" 
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</nav>

      {/* Main Section */}
      <div className="main_section">

        <h1>
          Your Knowledge Hub <br />
          <span>Anytime, Anywhere</span>
        </h1>

        <p>
          Stop searching everywhere. Find all your notes, collaborate with peers,
          and boost your learning in one powerful platform.
        </p>

        <div className="upload_section">
          <h2>📤 Upload Your Notes</h2>

          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleUpload}>
            Upload
          </button>
        </div>

      </div>

      {/* Library */}
      <div className="library_section">
        <h2>Edu Library</h2>

        {filteredNotes.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          <div className="library_grid">
            {filteredNotes.map((note, index) => (
              <div key={index} className="note_card">

                <h4>{note.title}</h4>

                {/* 🔥 NEW */}
                <p>
  Uploaded by: {note.username || note.userEmail || "User"}
</p>

                {note.fileType.startsWith("image") ? (
                  <img 
                    src={`http://localhost:5000/${note.filePath}`} 
                    alt="" 
                    className="preview" 
                  />
                ) : (
                  <img src={pdfIcon} alt="pdf" className="preview" />
                )}

                <p>{note.fileName}</p>

                <a 
                  href={`http://localhost:5000/${note.filePath}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Open
                </a>

                {" | "}

                <a 
                  href={`http://localhost:5000/${note.filePath}`} 
                  download
                >
                  Download
                </a>

                <br /><br />

                {/* 🔥 OWNER ONLY DELETE */}
                {user?.email === note.userEmail && (
                  <button onClick={() => handleDelete(note._id)}>
                    Delete
                  </button>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default Main