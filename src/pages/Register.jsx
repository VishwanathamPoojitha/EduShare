import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [data, setData] = useState({
    username: "",
    email: "",
    college: "",
    course: "",
    password: "",
    confirmPassword: ""
  })

  const { username, email, college, course, password, confirmPassword } = data

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (password.length < 6) {
  alert("Password must be at least 6 characters")
  return
}

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          college,
          course,
          password
        })
      })

      const result = await res.json()

      if (res.ok) {
        alert("Registration successful ✅")

        localStorage.setItem("user", JSON.stringify(result.user))

        window.dispatchEvent(new Event("userChanged"))

        navigate("/main")
      } else {
        alert(result.msg || "Registration failed")
      }

    } catch (error) {
      console.log(error)
      alert("Server error")
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h3>New to the app? Register Here</h3>

        <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required /><br />

        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required /><br />

        <input type="text" name="college" value={college} onChange={onChange} placeholder="College" required /><br />

        <input type="text" name="course" value={course} onChange={onChange} placeholder="Course" required /><br />

        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required /><br />

        <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register