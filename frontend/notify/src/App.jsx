
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import Home from './pages/home/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sign from './pages/signup/Sign'
import Login from './pages/login/Login'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/signup" element={<Sign/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
