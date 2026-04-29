import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const Home = () => {
    const navigate = useNavigate()
  return (
    <div className='Main_Heading'>
      <h1 className="title">EduShare – A Collaborative Notes Sharing Platform 📚</h1><br />
       <button onClick={()=>navigate('./auth')} className='Navigate' >Let's Explore</button>
    </div>
  )
}

export default Home
