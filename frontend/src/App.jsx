import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Equities from './pages/Equities'
import FX from './pages/FX'
import Rates from './pages/Rates'
import Credit from './pages/Credit'
import Commodities from './pages/Commodities'
import Securitized from './pages/Securitized'
import Structured from './pages/Structured'
import Macro from './pages/Macro'
import News from './pages/News'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equities" element={<Equities />} />
            <Route path="/fx" element={<FX />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/commodities" element={<Commodities />} />
            <Route path="/securitized" element={<Securitized />} />
            <Route path="/structured" element={<Structured />} />
            <Route path="/macro" element={<Macro />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
