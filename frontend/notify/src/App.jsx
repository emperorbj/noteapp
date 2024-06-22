
import './App.css'
import Home from './pages/home/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sign from './pages/signup/Sign'
import Login from './pages/login/Login'
import Welcome from './pages/home/Welcome'

function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome/>} />
          <Route path="/dashboard" element={<Home/>} />
          <Route path="/signup" element={<Sign/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
