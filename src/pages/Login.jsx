import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const { email, password } = data

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
       console.log("STATUS:", res.status)   // ✅

      const result = await res.json()
      console.log("RESPONSE:", result)     // ✅ DEBUG

      if (res.ok) {
        // ✅ Save user from backend
        localStorage.setItem("user", JSON.stringify(result.user))

        // ✅ Update UI instantly (profile)
        window.dispatchEvent(new Event("userChanged"))

        // ✅ Redirect
        navigate('/main')
      } else {
        alert(result.msg || "Login failed")
      }

    } catch (error) {
      console.log(error)
      alert("Server error")
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h3>Already Registered? Login Here</h3>

        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
        /><br />

        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login