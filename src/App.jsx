import React from 'react'
import { BrowserRouter , Route , Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import Main from './pages/Main'
import Auth from './pages/Auth'
export const App = () => {
  
  return (
    <div>
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route  path='/login' element={<Login/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path='/auth' element={<Auth/>}/>
        
       </Routes>
       </BrowserRouter>
    </div>
  )
}
export default App