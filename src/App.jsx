import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SearchPage from './Pages/SearchPage'
import  'bootstrap/dist/css/bootstrap.min.css'
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
